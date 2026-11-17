@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo       Namustutam POS - Automated Database Setup
echo ========================================================

set "PG_BIN="
set "PG_DATA="

if exist "%~dp0pgsql\bin\pg_ctl.exe" (
    set "PG_BIN=%~dp0pgsql\bin"
    set "PG_DATA=%~dp0pgsql\data"
) else if exist "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" (
    set "PG_BIN=C:\Program Files\PostgreSQL\18\bin"
    set "PG_DATA=C:\Program Files\PostgreSQL\18\data"
) else if exist "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" (
    set "PG_BIN=C:\Program Files\PostgreSQL\17\bin"
    set "PG_DATA=C:\Program Files\PostgreSQL\17\data"
) else if exist "C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe" (
    set "PG_BIN=C:\Program Files\PostgreSQL\16\bin"
    set "PG_DATA=C:\Program Files\PostgreSQL\16\data"
) else if exist "C:\Program Files\PostgreSQL\15\bin\pg_ctl.exe" (
    set "PG_BIN=C:\Program Files\PostgreSQL\15\bin"
    set "PG_DATA=C:\Program Files\PostgreSQL\15\data"
) else (
    for /f "tokens=*" %%i in ('where pg_ctl.exe 2^>nul') do (
        set "PG_BIN=%%~dpi"
    )
)

if "%PG_BIN%"=="" (
    echo [INFO] PostgreSQL binaries not found in default paths.
    echo Assuming PostgreSQL service is active on port 5432.
    goto check_db
)

echo [1/3] Found PostgreSQL binaries at: %PG_BIN%

echo [2/3] Checking PostgreSQL service status...
net start postgresql-x64-18 >nul 2>&1
net start postgresql-x64-17 >nul 2>&1
net start postgresql-x64-16 >nul 2>&1
net start postgresql-x64-15 >nul 2>&1

"%PG_BIN%\pg_ctl.exe" status -D "%PG_DATA%" >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL server not running, starting it now...
    if not exist "%PG_DATA%" (
        echo Initializing local PostgreSQL cluster...
        "%PG_BIN%\initdb.exe" -D "%PG_DATA%" -U postgres -A trust >nul 2>&1
    )
    start "" /b "%PG_BIN%\pg_ctl.exe" start -D "%PG_DATA%" -l "%PG_DATA%\logfile.txt"
    timeout /t 3 /nobreak >nul
) else (
    echo PostgreSQL server is running.
)

:check_db
echo [3/3] Ensuring database 'namustute_db_pos' exists...
if not "%PG_BIN%"=="" (
    if exist "%PG_BIN%\psql.exe" (
        "%PG_BIN%\psql.exe" -U postgres -h localhost -d postgres -c "SELECT 1 FROM pg_database WHERE datname='namustute_db_pos'" 2>nul | findstr /c:"1" >nul
        if !errorlevel! neq 0 (
            echo Creating database namustute_db_pos...
            "%PG_BIN%\psql.exe" -U postgres -h localhost -d postgres -c "CREATE DATABASE namustute_db_pos;" >nul 2>&1
        ) else (
            echo Database namustute_db_pos is ready.
        )
    )
)

echo Database initialization completed successfully!
