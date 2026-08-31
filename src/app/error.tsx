"use client";

import { useEffect } from "react";

// Without this, any uncaught error anywhere on the page (not just the 3D
// scene) unmounts the whole React tree and leaves visitors staring at a
// blank screen with no way back except a manual reload.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-5 text-center text-ink">
      <p className="text-lg font-medium">Что-то пошло не так</p>
      <p className="max-w-sm text-sm text-ink/60">
        Попробуйте обновить страницу — если проблема повторится, напишите
        мне.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
      >
        Обновить
      </button>
    </div>
  );
}
