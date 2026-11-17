@echo off
title WhatsApp Web Microservice (Port 3005)
color 0a

echo ========================================================
echo   Namustutam POS - WhatsApp Web Engine Launcher
echo   Port: 3005 ^| Multi-Tenant QR Pairing Engine
echo ========================================================
echo.

cd /d "%~dp0whatsapp-service"

if not exist "node_modules" (
    echo [ERROR] node_modules not found in whatsapp-service.
    echo Running npm install...
    call npm install
)

echo Starting WhatsApp Web microservice on http://localhost:3005...
node src/index.js

if errorlevel 1 (
    echo.
    echo [ERROR] WhatsApp microservice exited unexpectedly.
    pause
)
