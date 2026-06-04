# start-loadbalancer.ps1
# Builds the backend and starts the Docker Compose cluster with Nginx load balancing

$PORT = 3000
$ROOT_DIR = "C:\Users\aksha\OneDrive\Desktop\Namustutam\SaaS-namastute"
$BACKEND_DIR = "$ROOT_DIR\backend"

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Starting Namastute Load Balanced Cluster" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Kill old process on port 3000 ──────────────────────────────────
# This ensures that if you previously ran the native backend, the port is freed for Nginx
$connections = Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue

if ($connections) {
    foreach ($conn in $connections) {
        $procId = $conn.OwningProcess
        $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "  [KILLING] Port $PORT is held by '$($proc.ProcessName)' (PID $procId)" -ForegroundColor Yellow
            Stop-Process -Id $procId -Force
            Write-Host "  [DONE]    Process $procId killed." -ForegroundColor Green
        }
    }
    Start-Sleep -Seconds 1
} else {
    Write-Host "  [OK] Port $PORT is free." -ForegroundColor Green
}

# ── Step 2: Build the backend JAR ──────────────────────────────────────────
Write-Host ""
Write-Host "  [1/2] Building Spring Boot application..." -ForegroundColor Cyan
Set-Location $BACKEND_DIR
& ".\mvnw.cmd" clean package -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "  [ERROR] Maven build failed. Exiting." -ForegroundColor Red
    exit 1
}

# ── Step 3: Start Docker Compose ───────────────────────────────────────────
Write-Host ""
Write-Host "  [2/2] Starting Docker Compose cluster..." -ForegroundColor Cyan
Set-Location $ROOT_DIR

# Check if docker-compose is available
if (Get-Command "docker-compose" -ErrorAction SilentlyContinue) {
    docker-compose up --build -d
} else {
    docker compose up --build -d
}

Write-Host ""
Write-Host "  [SUCCESS] Cluster is starting in the background." -ForegroundColor Green
Write-Host "  Run 'docker-compose logs -f' to view logs." -ForegroundColor Gray
Write-Host "  Your backend is now load-balanced and accessible at http://localhost:$PORT" -ForegroundColor Cyan
Write-Host ""
