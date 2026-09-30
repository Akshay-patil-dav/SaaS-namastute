$ErrorActionPreference = "Stop"

$ProjectRoot = "c:\Users\aksha\OneDrive\Desktop\Namustutam\SaaS-namastute"
$DesktopEnv = Join-Path $ProjectRoot "Desktop-env"
$FrontendDir = Join-Path $ProjectRoot "_namustutam_UI"
$BackendDir = Join-Path $ProjectRoot "backend"
$BackendStaticDir = Join-Path $BackendDir "src\main\resources\static"

Write-Host "========================================="
Write-Host " Building Portable Deployment Environment"
Write-Host "========================================="

# 1. Clean Desktop-env
if (Test-Path $DesktopEnv) {
    Write-Host "Cleaning Desktop-env directory..."
    Remove-Item -Path $DesktopEnv -Recurse -Force
}
New-Item -ItemType Directory -Path $DesktopEnv | Out-Null
New-Item -ItemType Directory -Path "$DesktopEnv\pgsql" | Out-Null
New-Item -ItemType Directory -Path "$DesktopEnv\jre" | Out-Null

# 2. Download and Extract Portable JRE (Java 21)
Write-Host "Downloading Portable JRE 21..."
$jreUrl = "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jre/hotspot/normal/eclipse"
$jreZip = Join-Path $DesktopEnv "jre.zip"
Invoke-WebRequest -Uri $jreUrl -OutFile $jreZip
Write-Host "Extracting JRE..."
Expand-Archive -Path $jreZip -DestinationPath "$DesktopEnv\jre_temp" -Force
$extractedJreFolder = Get-ChildItem -Path "$DesktopEnv\jre_temp" -Directory | Select-Object -First 1
Move-Item -Path "$($extractedJreFolder.FullName)\*" -Destination "$DesktopEnv\jre" -Force
Remove-Item -Path $jreZip -Force
Remove-Item -Path "$DesktopEnv\jre_temp" -Recurse -Force

# 3. Download and Extract Portable PostgreSQL (16.4)
Write-Host "Downloading Portable PostgreSQL 16..."
$pgUrl = "https://get.enterprisedb.com/postgresql/postgresql-16.4-1-windows-x64-binaries.zip"
$pgZip = Join-Path $DesktopEnv "pgsql.zip"
Invoke-WebRequest -Uri $pgUrl -OutFile $pgZip
Write-Host "Extracting PostgreSQL..."
Expand-Archive -Path $pgZip -DestinationPath "$DesktopEnv\pgsql_temp" -Force
Move-Item -Path "$DesktopEnv\pgsql_temp\pgsql\*" -Destination "$DesktopEnv\pgsql" -Force
Remove-Item -Path $pgZip -Force
Remove-Item -Path "$DesktopEnv\pgsql_temp" -Recurse -Force

# 4. Build Frontend (_namustutam_UI)
Write-Host "Building Frontend (React/Vite)..."
Push-Location $FrontendDir
# Install deps just in case
npm install
npm run build
Pop-Location

# 5. Copy Frontend Dist to Backend Static Resources
Write-Host "Copying Frontend build to Backend..."
if (Test-Path $BackendStaticDir) {
    Remove-Item -Path "$BackendStaticDir\*" -Recurse -Force
} else {
    New-Item -ItemType Directory -Path $BackendStaticDir -Force | Out-Null
}
Copy-Item -Path "$FrontendDir\dist\*" -Destination $BackendStaticDir -Recurse -Force

# 6. Build Backend (Spring Boot)
Write-Host "Building Backend (Spring Boot)..."
Push-Location $BackendDir
# Use the local maven wrapper to build the jar
# We skip tests to speed up the portable build
.\mvnw.cmd clean package -DskipTests
Pop-Location

# 7. Copy jar to Desktop-env
Write-Host "Copying backend jar to Desktop-env..."
$jarFile = Get-ChildItem -Path "$BackendDir\target\*.jar" | Where-Object { $_.Name -notmatch "plain" } | Select-Object -First 1
Copy-Item -Path $jarFile.FullName -Destination "$DesktopEnv\app.jar" -Force

# 8. Create start.bat
Write-Host "Generating start.bat..."
$startBatContent = @"
@echo off
setlocal

echo [1/3] Initializing Database (if not already initialized)...
if not exist "pgsql\data" (
    echo Initializing new PostgreSQL data directory...
    pgsql\bin\initdb.exe -D "pgsql\data" -U postgres -W -A trust
    rem Note: We use trust authentication for local portable dev, but user might need to set password.
)

echo [2/3] Starting PostgreSQL...
start "PostgreSQL" pgsql\bin\pg_ctl.exe -D "pgsql\data" -l logfile start

echo Waiting for database to start...
timeout /t 3 /nobreak > nul

echo [3/3] Starting Application...
set JAVA_HOME=%CD%\jre
set PATH=%JAVA_HOME%\bin;%PATH%

start "Namustutam App" jre\bin\java.exe -jar app.jar

echo.
echo ========================================================
echo App and Database started successfully!
echo The app should be accessible at http://localhost:3000
echo Close this window to keep them running in background.
echo Use stop.bat to gracefully shutdown the application.
echo ========================================================
pause
"@
Set-Content -Path "$DesktopEnv\start.bat" -Value $startBatContent -Encoding UTF8

# 9. Create stop.bat
Write-Host "Generating stop.bat..."
$stopBatContent = @"
@echo off
setlocal

echo Stopping Application...
taskkill /f /im java.exe /fi "WINDOWTITLE eq Namustutam App" > nul 2>&1
taskkill /f /im java.exe > nul 2>&1

echo Stopping PostgreSQL...
pgsql\bin\pg_ctl.exe -D "pgsql\data" stop

echo All services stopped.
pause
"@
Set-Content -Path "$DesktopEnv\stop.bat" -Value $stopBatContent -Encoding UTF8

Write-Host "========================================="
Write-Host " Portable Deployment Environment Created!"
Write-Host " Location: $DesktopEnv"
Write-Host " Run start.bat inside that folder to begin."
Write-Host "========================================="
