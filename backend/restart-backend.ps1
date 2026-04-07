# restart-backend.ps1
# One-click: kill whatever is on port 3000 and restart Spring Boot
# Usage: Right-click -> "Run with PowerShell"  OR  run from terminal: .\restart-backend.ps1

$PORT = 3000
$BACKEND = "C:\Users\aksha\OneDrive\Desktop\Namustutam\SaaS-namastute\backend"

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Namastute Backend Restart Script" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Kill old process on port 3000 ──────────────────────────────────
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
    # Wait briefly for OS to release the port
    Start-Sleep -Seconds 1
} else {
    Write-Host "  [OK] Port $PORT is free." -ForegroundColor Green
}

Write-Host ""
Write-Host "  Starting Spring Boot backend on port $PORT ..." -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""

# ── Step 2: Start backend ───────────────────────────────────────────────────
Set-Location $BACKEND
& ".\mvnw.cmd" "spring-boot:run"
