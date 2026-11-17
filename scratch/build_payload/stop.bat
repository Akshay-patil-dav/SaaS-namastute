@echo off
setlocal
echo ========================================================
echo             Stopping Namustutam POS
echo ========================================================

echo Stopping Namustutam POS application processes...
taskkill /f /fi "WINDOWTITLE eq Namustutam POS Server*" /im java.exe >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq WhatsApp Service*" /im node.exe >nul 2>&1
taskkill /f /im namustutam_POS.exe >nul 2>&1
taskkill /f /im NamustutamPOS.exe >nul 2>&1

echo Stopping PostgreSQL if running standalone...
if exist "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" (
    "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" stop -D "C:\Program Files\PostgreSQL\18\data" -m fast >nul 2>&1
)
if exist "%~dp0pgsql\bin\pg_ctl.exe" (
    "%~dp0pgsql\bin\pg_ctl.exe" stop -D "%~dp0pgsql\data" -m fast >nul 2>&1
)

echo All services stopped cleanly.
timeout /t 2 /nobreak >nul
