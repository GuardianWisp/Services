"use client";

import { useEffect, useRef } from "react";
import { CASES, SERVICES } from "./data";

/**
 * Markup for the TETSAB Lab page. React renders it once; the imperative
 * runtime (scroll, WebGPU scene, cursor, sound, AI offer) attaches to it in an
 * effect and is torn down on unmount.
 */
export function LabRoot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import("./runtime/controller").then(({ startLab }) => {
      if (cancelled || !ref.current) return;
      dispose = startLab(ref.current);
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div className="tlab is-loading" ref={ref}>
      <canvas className="tlab-gl" aria-hidden="true" />
      <canvas className="tlab-wh" aria-hidden="true" />
      <div className="cur" aria-hidden="true">
        <i />
      </div>

      <div className="loader" aria-hidden="true">
        <div className="ld-mark">
          <div className="ld-word">
            {"BASTET".split("").map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </div>
          <div className="ld-refl">BASTET</div>
        </div>
        <div className="ld-count">000</div>
        <div className="ld-status mono">
          <div>
            Renderer · <b data-ld="renderer">…</b>
          </div>
          <div>
            Shader · <b data-ld="shader">…</b>
          </div>
          <div>
            Fonts · <b data-ld="fonts">…</b>
          </div>
          <div>
            Particles · <b data-ld="particles">…</b>
          </div>
        </div>
        <div className="lid t" />
        <div className="lid b" />
      </div>

      <header className="hud hud-tl">
        <a className="logo" href="#hero" data-nav="hero" data-w>
          <i />
          TETSAB
        </a>
      </header>
      <nav className="hud hud-tr" aria-label="Разделы">
        <a className="nav mono" href="#manifesto" data-nav="manifesto" data-w>
          Манифест
        </a>
        <a className="nav mono" href="#services" data-nav="services" data-w>
          Услуги
        </a>
        <a className="nav mono" href="#works" data-nav="works" data-w>
          Кейсы
        </a>
        <a className="nav mono" href="#contact" data-nav="contact" data-w>
          Контакт
        </a>
        <button type="button" className="snd mono" aria-pressed="false" data-w>
          <span className="eq">
            <i />
            <i />
            <i />
          </span>
          <span className="snd-l">Звук · выкл</span>
        </button>
      </nav>
      <div className="hud hud-bl mono" aria-hidden="true">
        <span className="h-xy">X 0000 · Y 0000</span>
        <span className="h-fps">— FPS</span>
        <span className="h-r">—</span>
      </div>
      <div className="hud hud-br mono">
        <button type="button" className="mode mono" data-w title="Как страница вас прочитала. Нажмите, чтобы выбрать режим вручную">
          Mode · <b className="mode-l">reading</b>
        </button>
        <span className="h-life">
          Life <b>01</b>/09 · dormant
        </span>
      </div>
      <div className="rail" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <main className="app">
        <section id="hero" className="hero wrap">
          <h1 className="sr">TETSAB — AI-студия: генеративные системы, AI-агенты, нейро-дизайн</h1>
          <div className="hero-foot">
            <div className="hero-l">
              <p className="mono eyebrow">
                AI-студия · <b>BASTET</b>, прочитанная наоборот
              </p>
              <p className="hero-tag">
                Интеллект, который <em className="serif">видит в&nbsp;темноте</em>.
              </p>
            </div>
            <div className="hero-r">
              <p className="hero-copy">Генеративные системы, AI-агенты и нейро-дизайн для брендов, которым тесно в шаблонах.</p>
              <p className="mono hint">Тяните — повернуть · Наведите — разбудить</p>
              <div className="cue mono">
                <span className="slit" />
                Скролл
              </div>
            </div>
          </div>
        </section>

        <section id="manifesto" className="manifesto" aria-label="Манифест">
          <div className="sticky">
            <p className="mono eyebrow man-eyebrow">
              Манифест · <b>life 03</b> — mirror
            </p>
            <div className="man-inner">
              <p className="man-line">
                Мы читаем мир <em className="serif">наоборот</em>.
              </p>
              <p className="man-line">От ответа — к вопросу.</p>
              <p className="man-line">От интуиции — к системе.</p>
              <p className="man-line">
                Мы строим интеллект, который <em className="serif">видит в темноте</em>.
              </p>
            </div>
          </div>
        </section>

        <section id="services" className="services" aria-label="AI-услуги">
          <div className="sticky">
            <div className="svc-grid">
              <div className="svc-left">
                <p className="mono eyebrow">AI Services · наведите — объект и частицы сменят форму</p>
                <ul className="svc-list">
                  {SERVICES.map((s) => (
                    <li className="svc-item" key={s.name}>
                      <button type="button" data-w>
                        <span className="n">Life 0{s.life}</span>
                        <span>{s.name}</span>
                        <span className="arr" aria-hidden="true">
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="svc-detail" aria-live="polite" />
              </div>
            </div>
          </div>
        </section>

        <section id="works" className="works" aria-label="Кейсы">
          <div className="sticky">
            <div className="works-head">
              <h2 className="works-title">
                Архив <span className="serif">works</span>
              </h2>
              <p className="mono eyebrow">4 концепт-кейса · данные иллюстративны · клик — открыть</p>
            </div>
            <div className="track">
              {CASES.map((c, i) => (
                <button type="button" className="card" data-w data-case={i} key={c.name} aria-label={`Открыть кейс ${c.name}`}>
                  <div className="card-cover">
                    <canvas width={480} height={600} />
                    <span className="mono card-open">Открыть</span>
                  </div>
                  <div className="card-meta mono">
                    <span>0{i + 1} / 04</span>
                    <span>{c.svc}</span>
                  </div>
                  <p className="card-name">{c.name}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="process wrap" aria-label="Процесс">
          <div className="proc-grid">
            <div className="proc-head">
              <p className="mono eyebrow">
                Процесс · охотничий цикл · <b>life 08</b> — coil
              </p>
              <h2 className="proc-title">
                Тихо. Точно. <span className="serif">Вовремя.</span>
              </h2>
            </div>
            <div className="proc-table">
              {[
                ["01 Observe", "Наблюдаем", "Интервью, данные, аудит процессов. Ищем место, где интеллект даст рычаг, а не шум.", "1–2 недели"],
                ["02 Stalk", "Выслеживаем", "Прототипы на ваших реальных данных, оценка качества и рисков до того, как тратить бюджет на продакшн.", "2–3 недели"],
                ["03 Pounce", "Прыжок", "Продакшн: интеграции, интерфейс, безопасность, запуск. Один точный прыжок вместо десяти попыток.", "4–10 недель"],
                ["04 Groom", "Ухаживаем", "Мониторинг, дообучение, метрики. Система становится лучше каждую неделю.", "постоянно"],
              ].map(([code, name, desc, dur]) => (
                <div className="proc-row" key={code}>
                  <span className="mono code">{code}</span>
                  <div>
                    <p className="proc-name">{name}</p>
                    <p className="proc-desc">{desc}</p>
                  </div>
                  <span className="mono proc-dur">{dur}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact wrap" aria-label="Контакт">
          <div className="ct-grid">
            <div className="ct-main">
              <p className="mono eyebrow">
                Контакт · AI-ассистент · <b>life 09</b> — signal
              </p>
              <h2 className="ct-title">
                Расскажите, на кого вы <span className="serif">охотитесь</span>.
              </h2>
              <p className="ct-lead">
                Опишите задачу своими словами — ассистент соберёт черновик предложения прямо здесь: подход, этапы, похожий кейс. Без цен и пустых обещаний.
              </p>
              <form className="ask" noValidate>
                <label className="mono" htmlFor="lab-brief">
                  Ваша задача
                </label>
                <textarea
                  id="lab-brief"
                  rows={3}
                  placeholder="Например: нужен AI-агент для поддержки интернет-магазина…"
                  defaultValue="Нужен AI-агент для поддержки интернет-магазина: около 3 000 обращений в месяц, отвечать в Telegram и в чате на сайте."
                />
                <div className="chip-row">
                  <span className="mono eyebrow">Формат</span>
                  <div className="chips" data-group="fmt">
                    {["Пилот", "Продукт", "Платформа"].map((v, i) => (
                      <button type="button" className="chip" aria-pressed={i === 0} data-w key={v}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="chip-row">
                  <span className="mono eyebrow">Сроки</span>
                  <div className="chips" data-group="time">
                    {["Срочно · до месяца", "1–3 месяца", "Не горит"].map((v, i) => (
                      <button type="button" className="chip" aria-pressed={i === 1} data-w key={v}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="actions">
                  <button type="submit" className="btn mag gen" data-w>
                    <span>Собрать офер</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <button type="button" className="btn ghost stop" data-w hidden>
                    <span>Остановить</span>
                  </button>
                </div>
                <p className="mono form-note" aria-live="polite" />
              </form>
              <div className="offer" hidden aria-live="polite">
                <div className="offer-top mono">
                  <span className="of-id">Offer · draft</span>
                  <b className="of-state">…</b>
                </div>
                <h3 className="of-title" />
                <p className="of-sum" />
                <div className="of-cols">
                  <div>
                    <p className="mono">Подход</p>
                    <ol className="of-app" />
                  </div>
                  <div>
                    <p className="mono">Этапы</p>
                    <ol className="of-st" />
                  </div>
                </div>
                <div className="of-foot">
                  <span className="mono of-dir" hidden />
                  <button type="button" className="linkbtn mono of-case" hidden data-w />
                </div>
                <div className="actions">
                  <button type="button" className="btn ghost of-copy" data-w>
                    <span>Скопировать</span>
                  </button>
                  <button type="button" className="btn ghost of-re" data-w>
                    <span>Пересобрать</span>
                  </button>
                </div>
                <p className="mono note of-note" />
              </div>
            </div>
          </div>
        </section>

        <footer className="foot mono">
          <span>
            © 2026 <b>TETSAB</b> · lab
          </span>
          <span className="clock">—</span>
          <span>Psst: напечатайте «bastet»</span>
        </footer>
      </main>

      <div className="case" role="dialog" aria-modal="true" aria-labelledby="lab-cs-title" tabIndex={-1} data-lenis-prevent>
        <div className="case-bar mono">
          <span className="cs-idx">Case 01/04</span>
          <button type="button" className="mono cs-close" data-w>
            Закрыть ✕
          </button>
        </div>
        <header className="case-cover">
          <canvas className="cs-cv" />
          <p className="mono cs-kind" />
          <h2 className="case-title" id="lab-cs-title" />
          <dl className="case-meta mono">
            <div>
              <dt>Клиент</dt>
              <dd>Концепт-кейс</dd>
            </div>
            <div>
              <dt>Год</dt>
              <dd>2026</dd>
            </div>
            <div>
              <dt>Направление</dt>
              <dd className="cs-svc" />
            </div>
            <div>
              <dt>Роль</dt>
              <dd className="cs-role" />
            </div>
          </dl>
        </header>
        <section className="case-block">
          <p className="lab mono">Проблема</p>
          <div className="body">
            <p className="problem cs-prob" />
            <p className="ctx cs-ctx" />
          </div>
        </section>
        <section className="case-block">
          <p className="lab mono">Интерактивное ядро</p>
          <div className="body">
            <div className="ba">
              <canvas className="ba-b" />
              <canvas className="ba-a after" />
              <div className="handle" />
              <span className="mono ba-l">До</span>
              <span className="mono ba-r">После</span>
              <input type="range" min={0} max={100} defaultValue={50} aria-label="Сравнить до и после" />
            </div>
            <p className="mono note cs-core" />
          </div>
        </section>
        <section className="case-block">
          <p className="lab mono">Процесс</p>
          <div className="body">
            <ol className="steps cs-steps" />
          </div>
        </section>
        <section className="case-block">
          <p className="lab mono">Результат</p>
          <div className="body">
            <div className="results cs-res" />
            <p className="mono note">Концепт-кейс для демонстрации подачи. Цифры иллюстративны.</p>
          </div>
        </section>
        <button type="button" className="next cs-next" data-w>
          <span className="mono">Следующий кейс</span>
          <span className="next-name cs-next-name" />
        </button>
      </div>
      <div className="toast mono" role="status" />
    </div>
  );
}
