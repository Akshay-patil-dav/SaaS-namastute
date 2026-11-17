$ErrorActionPreference = "Stop"

$ProjectRoot = (Get-Item ".").FullName
$CscPath = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$ExeAppDir = Join-Path $ProjectRoot "exe APP"
$OutExe = Join-Path $ExeAppDir "namustutam_POS.exe"

Write-Host "=================================================="
Write-Host " Building Namustutam POS Windows Setup Executable"
Write-Host "=================================================="

if (!(Test-Path $ExeAppDir)) {
    New-Item -ItemType Directory -Path $ExeAppDir -Force | Out-Null
}

$csFile = Join-Path $ProjectRoot "scratch\NamustutamPOS.cs"
$payloadDir = Join-Path $ProjectRoot "scratch\build_payload"
$rspFile = Join-Path $ProjectRoot "scratch\csc_build.rsp"

$rspContent = @"
/nologo
/target:winexe
/optimize+
/platform:anycpu
/out:"$OutExe"
/win32icon:"$payloadDir\app.ico"
/reference:System.dll
/reference:System.Drawing.dll
/reference:System.Windows.Forms.dll
/resource:"$payloadDir\app.jar",AppJar
/resource:"$payloadDir\app.ico",AppIcon
/resource:"$payloadDir\start.bat",StartBat
/resource:"$payloadDir\stop.bat",StopBat
/resource:"$payloadDir\setup_db.bat",SetupDbBat
/resource:"$payloadDir\uninstall.bat",UninstallBat
/resource:"$payloadDir\README.txt",ReadmeTxt
"$csFile"
"@

Set-Content -Path $rspFile -Value $rspContent -Encoding UTF8

Write-Host "Compiling executable using response file with native C# compiler..."
$proc = Start-Process -FilePath $CscPath -ArgumentList "@`"$rspFile`"" -NoNewWindow -Wait -PassThru

if ($proc.ExitCode -ne 0) {
    Write-Error "CSC compilation failed with code $($proc.ExitCode)"
    exit $proc.ExitCode
}

Write-Host "Copying companion scripts to '$ExeAppDir'..."
Copy-Item "$payloadDir\start.bat" "$ExeAppDir\start.bat" -Force
Copy-Item "$payloadDir\stop.bat" "$ExeAppDir\stop.bat" -Force
Copy-Item "$payloadDir\setup_db.bat" "$ExeAppDir\setup_db.bat" -Force
Copy-Item "$payloadDir\README.txt" "$ExeAppDir\README.txt" -Force

$exeItem = Get-Item $OutExe
$sizeMb = [math]::Round($exeItem.Length / 1MB, 2)

Write-Host "=================================================="
Write-Host " Build Succeeded!"
Write-Host " Output Executable: $OutExe"
Write-Host " Size: $sizeMb MB"
Write-Host "=================================================="
