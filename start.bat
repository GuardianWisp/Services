@echo off
rem Лаунчер Tetsab для Windows: двойной клик в Проводнике.
rem git pull (если нет незакоммиченных изменений) -> npm install при необходимости -> dev-сервер -> браузер.
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title Tetsab
set PORT=3000

where git >nul 2>nul
if errorlevel 1 goto nogit
where node >nul 2>nul
if errorlevel 1 goto nonode

set DIRTY=
for /f "delims=" %%s in ('git status --porcelain') do set DIRTY=1
if defined DIRTY goto dirty
git rev-parse --abbrev-ref --symbolic-full-name @{u} >nul 2>nul
if errorlevel 1 goto noupstream
echo Обновляю код: git pull...
git pull --ff-only
if errorlevel 1 echo ВНИМАНИЕ: git pull не удался - нет сети или ветки разошлись. Запускаю текущую версию.
goto pulled
:dirty
echo ВНИМАНИЕ: есть незакоммиченные изменения, git pull пропущен:
git status --short
echo Закоммитьте или отложите их - git stash, чтобы получать обновления.
goto pulled
:noupstream
echo ВНИМАНИЕ: у текущей ветки нет связанной ветки на GitHub, git pull пропущен.
:pulled

rem Зависимости ставятся, если node_modules нет или package-lock.json новее последней установки.
if not exist "node_modules\.package-lock.json" goto install
powershell -NoProfile -Command "if ((Get-Item package-lock.json).LastWriteTime -gt (Get-Item node_modules\.package-lock.json).LastWriteTime) { exit 1 }"
if errorlevel 1 goto install
goto deps_ok
:install
echo Устанавливаю зависимости: npm install...
call npm install --no-fund --no-audit
if errorlevel 1 goto fail
copy /b "node_modules\.package-lock.json" +,, "node_modules\.package-lock.json" >nul
:deps_ok

rem Браузер откроется, когда сервер начнёт слушать порт.
start "" /min powershell -NoProfile -WindowStyle Hidden -Command "for($i=0;$i -lt 90;$i++){try{(New-Object Net.Sockets.TcpClient).Connect('localhost',%PORT%);Start-Process 'http://localhost:%PORT%';break}catch{Start-Sleep 1}}"

echo Запускаю dev-сервер на http://localhost:%PORT% - остановить: Ctrl+C
call npm run dev -- -p %PORT%
pause
exit /b 0

:nogit
echo ОШИБКА: не найден git. Установите: winget install Git.Git и откройте окно заново.
pause
exit /b 1

:nonode
echo ОШИБКА: не найден Node.js. Установите LTS-версию с https://nodejs.org и запустите снова.
pause
exit /b 1

:fail
echo.
echo ОШИБКА: npm install завершился с ошибкой, см. сообщения выше.
pause
exit /b 1
