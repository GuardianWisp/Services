import { NextResponse } from "next/server";

const MAX_LENGTH = {
  name: 100,
  contact: 150,
  message: 2000,
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос." },
      { status: 400 },
    );
  }

  const { name, contact, message, consent, honeypot } = body as Record<
    string,
    unknown
  >;

  // Honeypot: real visitors never fill this hidden field. Pretend success
  // so bots don't learn anything from the response.
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof contact !== "string" ||
    !name.trim() ||
    !contact.trim() ||
    consent !== true
  ) {
    return NextResponse.json(
      { ok: false, error: "Заполните имя, контакт и согласие на обработку данных." },
      { status: 400 },
    );
  }

  const safeName = name.trim().slice(0, MAX_LENGTH.name);
  const safeContact = contact.trim().slice(0, MAX_LENGTH.contact);
  const safeMessage =
    typeof message === "string" ? message.trim().slice(0, MAX_LENGTH.message) : "";

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID is not configured");
    return NextResponse.json(
      { ok: false, error: "Форма временно недоступна, напишите в Telegram напрямую." },
      { status: 500 },
    );
  }

  const text = [
    "🆕 Новая заявка с сайта",
    "",
    `Имя: ${safeName}`,
    `Контакт: ${safeContact}`,
    `Сообщение: ${safeMessage || "—"}`,
  ].join("\n");

  // The first call after the server has been idle sometimes dies on a stale
  // keep-alive socket or a slow connect, so retry network errors and 5xx.
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = JSON.stringify({ chat_id: chatId, text });
  let sent = false;
  for (let attempt = 1; attempt <= 3 && !sent; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        signal: AbortSignal.timeout(8000),
      });
      if (response.ok) {
        sent = true;
      } else {
        const detail = await response.text();
        console.error("Telegram sendMessage failed", attempt, response.status, detail);
        if (response.status < 500 && response.status !== 429) break;
      }
    } catch (error) {
      console.error("Telegram sendMessage error", attempt, error);
    }
    if (!sent && attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }

  if (!sent) {
    return NextResponse.json(
      { ok: false, error: "Не удалось отправить заявку. Попробуйте написать в Telegram." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
