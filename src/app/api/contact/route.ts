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

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      },
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error("Telegram sendMessage failed", response.status, detail);
      return NextResponse.json(
        { ok: false, error: "Не удалось отправить заявку. Попробуйте написать в Telegram." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Telegram sendMessage error", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось отправить заявку. Попробуйте написать в Telegram." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
