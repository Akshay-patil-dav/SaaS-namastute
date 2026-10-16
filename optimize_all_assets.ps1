Add-Type -AssemblyName System.Drawing

function Resize-And-Save-Jpeg {
    param (
        [string]$sourcePath,
        [string]$destPath,
        [int]$quality = 84,
        [int]$maxDim = 1200
    )

    if (-not (Test-Path $sourcePath)) { return }

    $src = [System.Drawing.Image]::FromFile($sourcePath)
    $w = $src.Width
    $h = $src.Height

    if ($w -gt $maxDim -or $h -gt $maxDim) {
        if ($w -ge $h) {
            $nh = [int]($h * ($maxDim / $w))
            $nw = $maxDim
        } else {
            $nw = [int]($w * ($maxDim / $h))
            $nh = $maxDim
        }
    } else {
        $nw = $w
        $nh = $h
    }

    $destBitmap = New-Object System.Drawing.Bitmap($nw, $nh)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $graphics.DrawImage($src, 0, 0, $nw, $nh)

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)

    $destBitmap.Save($destPath, $codec, $encoderParams)

    $graphics.Dispose()
    $destBitmap.Dispose()
    $src.Dispose()

    $origSize = (Get-Item $sourcePath).Length
    $newSize = (Get-Item $destPath).Length
    Write-Host "JPG: $([System.IO.Path]::GetFileName($sourcePath)) ($([math]::Round($origSize/1024,1)) KB) -> $([System.IO.Path]::GetFileName($destPath)) ($([math]::Round($newSize/1024,1)) KB)"
}

function Resize-And-Save-Png {
    param (
        [string]$sourcePath,
        [string]$destPath,
        [int]$maxDim = 600
    )

    if (-not (Test-Path $sourcePath)) { return }

    $src = [System.Drawing.Image]::FromFile($sourcePath)
    $w = $src.Width
    $h = $src.Height

    if ($w -gt $maxDim -or $h -gt $maxDim) {
        if ($w -ge $h) {
            $nh = [int]($h * ($maxDim / $w))
            $nw = $maxDim
        } else {
            $nw = [int]($w * ($maxDim / $h))
            $nh = $maxDim
        }
    } else {
        $nw = $w
        $nh = $h
    }

    $destBitmap = New-Object System.Drawing.Bitmap($nw, $nh)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $graphics.DrawImage($src, 0, 0, $nw, $nh)

    $tempDest = $destPath + ".tmp.png"
    $destBitmap.Save($tempDest, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $destBitmap.Dispose()
    $src.Dispose()

    $origSize = (Get-Item $sourcePath).Length
    Remove-Item $sourcePath -Force
    Move-Item $tempDest $destPath -Force

    $newSize = (Get-Item $destPath).Length
    Write-Host "PNG: $([System.IO.Path]::GetFileName($destPath)) ($([math]::Round($origSize/1024,1)) KB) -> ($([math]::Round($newSize/1024,1)) KB)"
}

Write-Host "=== Optimizing Project Images to JPEG ==="
Resize-And-Save-Jpeg "_namustutam_UI\src\assets\project\p1.png" "_namustutam_UI\src\assets\project\p1.jpg" 84 1200
Resize-And-Save-Jpeg "_namustutam_UI\src\assets\project\p5.png" "_namustutam_UI\src\assets\project\p5.jpg" 84 1200
Resize-And-Save-Jpeg "_namustutam_UI\src\assets\project\p6.png" "_namustutam_UI\src\assets\project\p6.jpg" 84 1200
Resize-And-Save-Jpeg "_namustutam_UI\src\assets\project\p7.png" "_namustutam_UI\src\assets\project\p7.jpg" 84 1200

Write-Host "=== Optimizing Public Heavy Images ==="
Resize-And-Save-Png "_namustutam_UI\public\team\Akshay.png" "_namustutam_UI\public\team\Akshay.png" 600
Resize-And-Save-Png "_namustutam_UI\public\logo.png" "_namustutam_UI\public\logo.png" 256
Resize-And-Save-Png "_namustutam_UI\public\about_team.png" "_namustutam_UI\public\about_team.png" 800
Resize-And-Save-Png "_namustutam_UI\public\guy_working.png" "_namustutam_UI\public\guy_working.png" 800
Resize-And-Save-Png "_namustutam_UI\public\hero_person.png" "_namustutam_UI\public\hero_person.png" 800
Resize-And-Save-Png "_namustutam_UI\public\hero_retail_saas.png" "_namustutam_UI\public\hero_retail_saas.png" 800
Resize-And-Save-Png "_namustutam_UI\public\mobile_app_ui.png" "_namustutam_UI\public\mobile_app_ui.png" 800
Resize-And-Save-Png "_namustutam_UI\public\shopify11.png" "_namustutam_UI\public\shopify11.png" 1000
Resize-And-Save-Png "_namustutam_UI\public\wpweb1.png" "_namustutam_UI\public\wpweb1.png" 1000
Resize-And-Save-Png "_namustutam_UI\public\wpweb11.png" "_namustutam_UI\public\wpweb11.png" 800

# Remove temporary test files
if (Test-Path "_namustutam_UI\public\team\Akshay_opt.png") { Remove-Item "_namustutam_UI\public\team\Akshay_opt.png" -Force }
if (Test-Path "_namustutam_UI\public\logo_opt.png") { Remove-Item "_namustutam_UI\public\logo_opt.png" -Force }
if (Test-Path "test_png.ps1") { Remove-Item "test_png.ps1" -Force }
