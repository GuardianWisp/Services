"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export function LeadForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !contact.trim()) {
      setStatus("error");
      setError("Заполните имя и контакт для связи.");
      return;
    }
    if (!consent) {
      setStatus("error");
      setError("Нужно согласие на обработку данных.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message, consent, honeypot }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось отправить заявку.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось отправить заявку. Попробуйте написать в Telegram.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-paper/15 bg-paper/5 p-6 text-center">
        <p className="text-base font-medium text-paper">Заявка отправлена</p>
        <p className="mt-1 text-sm text-paper/70">
          Отвечу в течение дня. Спасибо!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3">
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя"
          maxLength={100}
          className="w-full rounded-xl border border-paper/20 bg-paper/10 px-4 py-3 text-sm text-paper placeholder:text-paper/45 outline-none transition-colors focus:border-accent"
        />
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Telegram, телефон или почта"
          maxLength={150}
          className="w-full rounded-xl border border-paper/20 bg-paper/10 px-4 py-3 text-sm text-paper placeholder:text-paper/45 outline-none transition-colors focus:border-accent"
        />
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Что нужно сделать (необязательно)"
        rows={3}
        maxLength={2000}
        className="w-full resize-none rounded-xl border border-paper/20 bg-paper/10 px-4 py-3 text-sm text-paper placeholder:text-paper/45 outline-none transition-colors focus:border-accent"
      />

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-paper/60">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          style={{ accentColor: "var(--color-accent)" }}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-paper/30"
        />
        Согласен с{" "}
        <Link href="/privacy" className="underline hover:text-paper">
          политикой конфиденциальности
        </Link>{" "}
        и обработкой персональных данных
      </label>

      {status === "error" ? (
        <p className="text-xs text-red-300">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-contrast transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Отправить заявку
      </button>
    </form>
  );
}
