Add-Type -AssemblyName System.Drawing

function Optimize-Png {
    param (
        [string]$sourcePath,
        [string]$destPath,
        [int]$maxDim = 600
    )

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

    $destBitmap.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $destBitmap.Dispose()
    $src.Dispose()

    $origSize = (Get-Item $sourcePath).Length
    $newSize = (Get-Item $destPath).Length
    Write-Host "Optimized PNG: $([System.IO.Path]::GetFileName($sourcePath)) ($([math]::Round($origSize/1KB,1)) KB) -> $([System.IO.Path]::GetFileName($destPath)) ($([math]::Round($newSize/1KB,1)) KB)"
}

Optimize-Png "_namustutam_UI\public\team\Akshay.png" "_namustutam_UI\public\team\Akshay_opt.png" 600
Optimize-Png "_namustutam_UI\public\logo.png" "_namustutam_UI\public\logo_opt.png" 256
