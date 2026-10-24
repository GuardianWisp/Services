import { NextResponse } from "next/server";
import { linkMessage, markKnown, visitorFor } from "@/lib/telegram-relay";

// Two-way relay for @tetsabbot. Whatever a visitor writes to the bot is
// forwarded to TELEGRAM_CHAT_ID; when the owner replies (Telegram "Reply")
// to that forwarded message, the bot copies the reply back to the visitor.
//
// Register once with:
//   curl "https://api.telegram.org/bot<token>/setWebhook" \
//     -d url=https://tetsab.ru/api/telegram/webhook \
//     -d secret_token=<TELEGRAM_WEBHOOK_SECRET> \
//     -d 'allowed_updates=["message"]'

const GREETING = [
  "Здравствуйте! Это TETSAB — дизайн и сайты.",
  "",
  "Напишите, что вам нужно, — ответим прямо в этом чате.",
].join("\n");

type TgUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
};

type TgMessage = {
  message_id: number;
  chat: { id: number; type: string };
  from?: TgUser;
  text?: string;
  reply_to_message?: { message_id: number };
};

type TgResult<T> = { ok: boolean; result?: T; error_code?: number; description?: string };

async function tg<T = unknown>(method: string, params: object): Promise<TgResult<T>> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await response.json()) as TgResult<T>;
    if (!data.ok) console.error("Telegram", method, "failed", data.error_code, data.description);
    return data;
  } catch (error) {
    console.error("Telegram", method, "error", error);
    return { ok: false };
  }
}

function describe(user: TgUser | undefined, chatId: number) {
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Без имени";
  const handle = user?.username ? `@${user.username}` : "без username";
  return `${name} · ${handle} · id ${chatId}`;
}

async function fromVisitor(message: TgMessage, ownerChatId: number) {
  const visitorId = message.chat.id;
  const isStart = message.text?.startsWith("/start") ?? false;

  if (isStart) {
    await tg("sendMessage", { chat_id: visitorId, text: GREETING });
  }

  if (await markKnown(visitorId)) {
    // t.me/tetsabbot?start=2gis arrives as "/start 2gis".
    const source = isStart ? message.text!.slice("/start".length).trim() : "";
    const lines = ["💬 Новый диалог в боте", describe(message.from, visitorId)];
    if (source) lines.push(`Источник: ${source}`);
    lines.push("", "Отвечайте через Reply на сообщения из этого диалога — ответ уйдёт от имени бота.");
    const header = await tg<{ message_id: number }>("sendMessage", {
      chat_id: ownerChatId,
      text: lines.join("\n"),
    });
    if (header.result) await linkMessage(header.result.message_id, visitorId);
  }

  // A bare /start carries nothing worth forwarding.
  if (isStart) return;

  const forwarded = await tg<{ message_id: number }>("forwardMessage", {
    chat_id: ownerChatId,
    from_chat_id: visitorId,
    message_id: message.message_id,
  });
  if (forwarded.result) await linkMessage(forwarded.result.message_id, visitorId);
}

async function fromOwner(message: TgMessage, ownerChatId: number) {
  const replyTo = message.reply_to_message?.message_id;
  const visitorId = replyTo ? await visitorFor(replyTo) : undefined;

  if (!visitorId) {
    // Ignore plain notes in the owner's chat unless they look like a reply attempt.
    if (replyTo) {
      await tg("sendMessage", {
        chat_id: ownerChatId,
        reply_parameters: { message_id: message.message_id },
        text: "Не знаю, кому это отправить: это не сообщение из диалога в боте.",
      });
    }
    return;
  }

  const copied = await tg("copyMessage", {
    chat_id: visitorId,
    from_chat_id: ownerChatId,
    message_id: message.message_id,
  });

  if (copied.ok) {
    await tg("setMessageReaction", {
      chat_id: ownerChatId,
      message_id: message.message_id,
      reaction: [{ type: "emoji", emoji: "👍" }],
    });
  } else {
    await tg("sendMessage", {
      chat_id: ownerChatId,
      reply_parameters: { message_id: message.message_id },
      text:
        copied.error_code === 403
          ? "Не доставлено: человек заблокировал бота."
          : `Не доставлено: ${copied.description ?? "ошибка Telegram"}.`,
    });
  }
}

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const ownerChatId = Number(process.env.TELEGRAM_CHAT_ID);

  if (
    !secret ||
    request.headers.get("x-telegram-bot-api-secret-token") !== secret
  ) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!process.env.TELEGRAM_BOT_TOKEN || !ownerChatId) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID is not configured");
    return NextResponse.json({ ok: true });
  }

  let update: { message?: TgMessage };
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = update.message;
  // Groups the bot may get added to are not part of the relay.
  if (message && message.chat.type === "private") {
    if (message.chat.id === ownerChatId) {
      await fromOwner(message, ownerChatId);
    } else {
      await fromVisitor(message, ownerChatId);
    }
  }

  // Always 200, otherwise Telegram keeps redelivering the same update.
  return NextResponse.json({ ok: true });
}
