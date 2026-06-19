# Generates assets/icon.png (256x256) and assets/icon.ico (multi-size) for the
# stm32_usb_hid_tool_v2 application. The icon depicts a small keyboard.
#
# Run from the project root:
#   powershell -ExecutionPolicy Bypass -File assets/generate_icon.ps1

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

$here     = Split-Path -Parent $MyInvocation.MyCommand.Path
$pngPath  = Join-Path $here 'icon.png'
$icoPath  = Join-Path $here 'icon.ico'

# Theme colors aligned with the app's dark MUI palette.
$bgTop     = [System.Drawing.Color]::FromArgb(255,  37,  52,  77)   # #25344d
$bgBottom  = [System.Drawing.Color]::FromArgb(255,  25,  34,  49)   # #192231
$bodyTop   = [System.Drawing.Color]::FromArgb(255,  60,  82, 117)
$bodyBot   = [System.Drawing.Color]::FromArgb(255,  40,  58,  86)
$keyTop    = [System.Drawing.Color]::FromArgb(255, 224, 242, 241)   # #e0f2f1
$keyBot    = [System.Drawing.Color]::FromArgb(255, 178, 223, 219)
$keyEdge   = [System.Drawing.Color]::FromArgb(255,  88, 147, 223)   # primary #5893df
$accent    = [System.Drawing.Color]::FromArgb(255,  46, 197, 211)   # secondary #2ec5d3

function New-RoundedPath {
    param(
        [float]$x, [float]$y, [float]$w, [float]$h, [float]$r
    )
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $p.AddArc($x,       $y,         $d, $d, 180, 90)
    $p.AddArc($x+$w-$d, $y,         $d, $d, 270, 90)
    $p.AddArc($x+$w-$d, $y+$h-$d,   $d, $d,   0, 90)
    $p.AddArc($x,       $y+$h-$d,   $d, $d,  90, 90)
    $p.CloseFigure()
    return $p
}

function Draw-Icon {
    param([int]$size)

    $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode    = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode  = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background rounded square.
    $bgRect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
    $bgPath = New-RoundedPath 0 0 $size $size ($size * 0.18)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $bgRect, $bgTop, $bgBottom, 90
    $g.FillPath($bgBrush, $bgPath)
    $bgBrush.Dispose()
    $bgPath.Dispose()

    # Keyboard body proportions (relative to icon size).
    $bodyX = $size * 0.10
    $bodyY = $size * 0.26
    $bodyW = $size * 0.80
    $bodyH = $size * 0.48
    $bodyR = $size * 0.06

    # Body shadow.
    $shadowPath = New-RoundedPath $bodyX ($bodyY + $size * 0.03) $bodyW $bodyH $bodyR
    $shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(80, 0, 0, 0))
    $g.FillPath($shadowBrush, $shadowPath)
    $shadowBrush.Dispose()
    $shadowPath.Dispose()

    # Body.
    $bodyRect = New-Object System.Drawing.RectangleF $bodyX, $bodyY, $bodyW, $bodyH
    $bodyPath = New-RoundedPath $bodyX $bodyY $bodyW $bodyH $bodyR
    $bodyBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $bodyRect, $bodyTop, $bodyBot, 90
    $g.FillPath($bodyBrush, $bodyPath)
    $bodyBrush.Dispose()

    $bodyPen = New-Object System.Drawing.Pen $keyEdge, ([Math]::Max(1, $size * 0.012))
    $g.DrawPath($bodyPen, $bodyPath)
    $bodyPen.Dispose()
    $bodyPath.Dispose()

    # Key grid (4 rows × 10 cols, plus a space bar).
    $rows = 4
    $cols = 10
    $padX = $size * 0.04
    $padY = $size * 0.035
    $gap  = [Math]::Max(1, $size * 0.012)

    $gridX = $bodyX + $padX
    $gridY = $bodyY + $padY
    $gridW = $bodyW - 2 * $padX
    $gridH = $bodyH - 2 * $padY - ($size * 0.08)   # leave room for space bar

    $keyW = ($gridW - ($gap * ($cols - 1))) / $cols
    $keyH = ($gridH - ($gap * ($rows - 1))) / $rows
    $keyR = [Math]::Min($keyW, $keyH) * 0.18

    for ($row = 0; $row -lt $rows; $row++) {
        $offset = $row * ($keyW * 0.35)
        for ($col = 0; $col -lt $cols; $col++) {
            $kx = $gridX + $offset + $col * ($keyW + $gap)
            $ky = $gridY + $row * ($keyH + $gap)
            if (($kx + $keyW) -gt ($gridX + $gridW)) { break }

            $keyRect = New-Object System.Drawing.RectangleF $kx, $ky, $keyW, $keyH
            $keyPath = New-RoundedPath $kx $ky $keyW $keyH $keyR

            # Highlight a couple of keys with the accent color.
            $highlight = ($row -eq 1 -and ($col -eq 3 -or $col -eq 6)) -or `
                         ($row -eq 2 -and $col -eq 4)
            if ($highlight) {
                $brush = New-Object System.Drawing.SolidBrush $accent
            } else {
                $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $keyRect, $keyTop, $keyBot, 90
            }
            $g.FillPath($brush, $keyPath)
            $brush.Dispose()
            $keyPath.Dispose()
        }
    }

    # Space bar.
    $sbX = $gridX + ($gridW * 0.20)
    $sbY = $gridY + $gridH + $gap
    $sbW = $gridW * 0.55
    $sbH = $size * 0.07
    $sbR = $sbH * 0.35
    $sbRect = New-Object System.Drawing.RectangleF $sbX, $sbY, $sbW, $sbH
    $sbPath = New-RoundedPath $sbX $sbY $sbW $sbH $sbR
    $sbBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $sbRect, $keyTop, $keyBot, 90
    $g.FillPath($sbBrush, $sbPath)
    $sbBrush.Dispose()
    $sbPath.Dispose()

    # USB plug detail dangling from the top-left.
    $plugW = $size * 0.10
    $plugH = $size * 0.06
    $plugX = $bodyX + ($bodyW * 0.12)
    $plugY = $bodyY - $plugH - 2
    $cableX = $plugX + ($plugW / 2)
    $cablePen = New-Object System.Drawing.Pen $keyEdge, ([Math]::Max(1, $size * 0.018))
    $g.DrawLine($cablePen, $cableX, ($plugY + $plugH), $cableX, ($bodyY + 1))
    $cablePen.Dispose()

    $plugPath = New-RoundedPath $plugX $plugY $plugW $plugH ($plugH * 0.3)
    $plugBrush = New-Object System.Drawing.SolidBrush $keyEdge
    $g.FillPath($plugBrush, $plugPath)
    $plugBrush.Dispose()
    $plugPath.Dispose()

    $g.Dispose()
    return $bmp
}

# Sizes to embed in the multi-size ICO.
$sizes = 16, 24, 32, 48, 64, 128, 256

# Generate per-size PNG byte arrays.
$pngBlobs = @{}
foreach ($s in $sizes) {
    $bmp = Draw-Icon -size $s
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBlobs[$s] = $ms.ToArray()
    $bmp.Dispose()
    $ms.Dispose()
}

# Save the 256x256 PNG as icon.png (electron-builder's PNG fallback).
[System.IO.File]::WriteAllBytes($pngPath, $pngBlobs[256])
Write-Host ("Wrote " + $pngPath + " (" + $pngBlobs[256].Length + " bytes)")

# Build the ICO container. Format:
#   ICONDIR (6 bytes)
#   ICONDIRENTRY * N (16 bytes each)
#   PNG payload * N
$count = $sizes.Length
$dirEntrySize = 16
$headerSize = 6 + $count * $dirEntrySize

$out = New-Object System.IO.MemoryStream
$bw  = New-Object System.IO.BinaryWriter $out

# ICONDIR
$bw.Write([uint16]0)          # reserved
$bw.Write([uint16]1)          # type = icon
$bw.Write([uint16]$count)     # image count

# Directory entries (offsets computed up front).
$offset = $headerSize
foreach ($s in $sizes) {
    $blob = $pngBlobs[$s]
    $w = if ($s -ge 256) { 0 } else { $s }
    $h = if ($s -ge 256) { 0 } else { $s }
    $bw.Write([byte]$w)         # width  (0 means 256)
    $bw.Write([byte]$h)         # height (0 means 256)
    $bw.Write([byte]0)          # color count (0 for true-color)
    $bw.Write([byte]0)          # reserved
    $bw.Write([uint16]1)        # planes
    $bw.Write([uint16]32)       # bit count
    $bw.Write([uint32]$blob.Length)
    $bw.Write([uint32]$offset)
    $offset += $blob.Length
}

# PNG payloads.
foreach ($s in $sizes) {
    $blob = $pngBlobs[$s]
    $bw.Write($blob, 0, $blob.Length)
}

$bw.Flush()
[System.IO.File]::WriteAllBytes($icoPath, $out.ToArray())
$bw.Dispose()
$out.Dispose()

Write-Host ("Wrote " + $icoPath + " (" + (Get-Item $icoPath).Length + " bytes)")
