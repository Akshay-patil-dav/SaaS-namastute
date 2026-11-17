@echo off
setlocal enabledelayedexpansion
title Namustutam POS Launcher

echo ========================================================
echo             Starting Namustutam POS
echo ========================================================

:: 1. Database Setup & Start
call "%~dp0setup_db.bat"

:: 2. Locate & Start WhatsApp Microservice (port 3005)
set "WA_DIR="
if exist "%~dp0whatsapp-service\src\index.js" (
    set "WA_DIR=%~dp0whatsapp-service"
) else if exist "%~dp0..\whatsapp-service\src\index.js" (
    set "WA_DIR=%~dp0..\whatsapp-service"
)

if not "%WA_DIR%"=="" (
    echo Starting WhatsApp Web microservice on port 3005...
    start "WhatsApp Service" /d "%WA_DIR%" /min cmd /c "node src\index.js"
)

:: 3. Locate Java Runtime
set "JAVA_EXE="
if exist "%~dp0jre\bin\java.exe" (
    set "JAVA_EXE=%~dp0jre\bin\java.exe"
) else if not "%JAVA_HOME%"=="" (
    if exist "%JAVA_HOME%\bin\java.exe" set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
)
if "!JAVA_EXE!"=="" (
    if exist "C:\Program Files\Java\jdk-27\bin\java.exe" (
        set "JAVA_EXE=C:\Program Files\Java\jdk-27\bin\java.exe"
    ) else if exist "C:\Program Files\Java\latest\bin\java.exe" (
        set "JAVA_EXE=C:\Program Files\Java\latest\bin\java.exe"
    ) else if exist "C:\Program Files\Common Files\Oracle\Java\javapath\java.exe" (
        set "JAVA_EXE=C:\Program Files\Common Files\Oracle\Java\javapath\java.exe"
    ) else (
        for /f "tokens=*" %%i in ('where java.exe 2^>nul') do (
            set "JAVA_EXE=%%i"
        )
    )
)

if "!JAVA_EXE!"=="" (
    echo [ERROR] Java 21+ Runtime not found. Please install Java from https://adoptium.net/
    pause
    exit /b 1
)

echo Using Java: !JAVA_EXE!

:: 4. Launch App JAR
echo Launching Namustutam POS backend and UI engine...
start "Namustutam POS Server" /b "!JAVA_EXE!" -jar "%~dp0app.jar"

echo Waiting for application to initialize on http://localhost:3000...
timeout /t 5 /nobreak >nul

:: 5. Open in browser
start http://localhost:3000

echo ========================================================
echo  Namustutam POS is running at http://localhost:3000
echo  Use stop.bat to stop the application.
echo ========================================================
