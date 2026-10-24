#!/bin/bash
# Лаунчер Tetsab для Mac: двойной клик в Finder.
# git pull (если нет незакоммиченных изменений) → npm install при необходимости → dev-сервер → браузер.
PORT=3000

cd "$(dirname "$0")" || exit 1

fail() {
  echo
  echo "ОШИБКА: $1"
  read -r -p "Нажмите Enter, чтобы закрыть окно..."
  exit 1
}

command -v git >/dev/null 2>&1 || fail "не найден git. Установите: xcode-select --install"
command -v node >/dev/null 2>&1 || fail "не найден Node.js. Установите LTS-версию с https://nodejs.org"
command -v npm >/dev/null 2>&1 || fail "не найден npm (ставится вместе с Node.js с https://nodejs.org)"

if [ -n "$(git status --porcelain)" ]; then
  echo "ВНИМАНИЕ: есть незакоммиченные изменения, git pull пропущен:"
  git status --short
  echo "Закоммитьте или отложите их (git stash), чтобы получать обновления."
elif ! git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
  echo "ВНИМАНИЕ: у ветки $(git branch --show-current) нет связанной ветки на GitHub, git pull пропущен."
else
  echo "Обновляю код: git pull..."
  git pull --ff-only || echo "ВНИМАНИЕ: git pull не удался (нет сети или ветки разошлись). Запускаю текущую версию."
fi

# Зависимости ставятся, если node_modules нет или package-lock.json новее последней установки.
if [ ! -f node_modules/.package-lock.json ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  echo "Устанавливаю зависимости: npm install..."
  npm install --no-fund --no-audit || fail "npm install завершился с ошибкой, см. сообщения выше"
  touch node_modules/.package-lock.json
fi

# Браузер откроется, когда сервер начнёт слушать порт.
(
  for _ in $(seq 1 90); do
    nc -z localhost "$PORT" >/dev/null 2>&1 && { open "http://localhost:$PORT"; exit 0; }
    sleep 1
  done
) &

echo "Запускаю dev-сервер на http://localhost:$PORT (остановить: Ctrl+C)"
npm run dev -- -p "$PORT"
read -r -p "Сервер остановлен. Нажмите Enter, чтобы закрыть окно..."
