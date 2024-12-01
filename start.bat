@echo off

:: Ouvrir le premier terminal pour le backend
start cmd /k "cd /d %~dp0backend && npm run dev"

:: Ouvrir le deuxième terminal pour le frontend
start cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 5

start http://localhost:5173/