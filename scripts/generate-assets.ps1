Add-Type -AssemblyName System.Drawing

function Create-ArtImage {
    param (
        [string]$Path,
        [int]$Width,
        [int]$Height,
        [string]$Category,
        [string]$Title,
        [string]$Subtitle,
        [System.Drawing.Color]$TopColor,
        [System.Drawing.Color]$BottomColor
    )

    $bmp = [System.Drawing.Bitmap]::new($Width, $Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background gradient
    $pt1 = [System.Drawing.Point]::new(0, 0)
    $pt2 = [System.Drawing.Point]::new($Width, $Height)
    $bgBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($pt1, $pt2, $TopColor, $BottomColor)
    $g.FillRectangle($bgBrush, 0, 0, $Width, $Height)
    $bgBrush.Dispose()

    # Subtle inner border
    $goldPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(140, 197, 168, 128), 2)
    $g.DrawRectangle($goldPen, 30, 30, ($Width - 60), ($Height - 60))
    $goldPen2 = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(80, 197, 168, 128), 1)
    $g.DrawRectangle($goldPen2, 38, 38, ($Width - 76), ($Height - 76))
    $goldPen.Dispose()
    $goldPen2.Dispose()

    # Center circle vignette or silhouette framing
    $centerX = [int]($Width / 2)
    $centerY = [int]($Height / 2)
    $radius = [int]([Math]::Min($Width, $Height) * 0.28)
    
    $vignetteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(35, 255, 255, 255))
    $g.FillEllipse($vignetteBrush, ($centerX - $radius), ($centerY - $radius - 40), ($radius * 2), ($radius * 2))
    $vignetteBrush.Dispose()

    $ringPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(180, 215, 185, 142), 2)
    $g.DrawEllipse($ringPen, ($centerX - $radius), ($centerY - $radius - 40), ($radius * 2), ($radius * 2))
    $ringPen.Dispose()

    # Decorative Monogram or Heart in Center
    $heartFont = [System.Drawing.Font]::new("Georgia", 40, [System.Drawing.FontStyle]::Bold)
    $heartBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(210, 180, 145, 100))
    $sf = [System.Drawing.StringFormat]::new()
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString([char]0x2665, $heartFont, $heartBrush, [System.Drawing.RectangleF]::new(($centerX - 50), ($centerY - 90), 100, 100), $sf)
    $heartFont.Dispose()
    $heartBrush.Dispose()

    # Category pill at top
    $catFont = [System.Drawing.Font]::new("Arial", 11, [System.Drawing.FontStyle]::Bold)
    $catBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(180, 140, 120, 100))
    $g.DrawString($Category.ToUpper(), $catFont, $catBrush, [System.Drawing.RectangleF]::new(40, 70, ($Width - 80), 30), $sf)
    $catFont.Dispose()
    $catBrush.Dispose()

    # Main Title
    $titleFont = [System.Drawing.Font]::new("Georgia", 28, [System.Drawing.FontStyle]::Italic)
    $titleBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(240, 65, 52, 45))
    $g.DrawString($Title, $titleFont, $titleBrush, [System.Drawing.RectangleF]::new(50, ($centerY + $radius - 20), ($Width - 100), 50), $sf)
    $titleFont.Dispose()
    $titleBrush.Dispose()

    # Subtitle / Details
    $subFont = [System.Drawing.Font]::new("Georgia", 13, [System.Drawing.FontStyle]::Regular)
    $subBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(180, 110, 95, 85))
    $g.DrawString($Subtitle, $subFont, $subBrush, [System.Drawing.RectangleF]::new(50, ($centerY + $radius + 35), ($Width - 100), 40), $sf)
    $subFont.Dispose()
    $subBrush.Dispose()

    # Date at bottom
    $dateFont = [System.Drawing.Font]::new("Arial", 10, [System.Drawing.FontStyle]::Regular)
    $dateBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(140, 150, 135, 120))
    $g.DrawString("SEPTEMBER 18, 2027 • BEVERLY HILLS", $dateFont, $dateBrush, [System.Drawing.RectangleF]::new(50, ($Height - 75), ($Width - 100), 30), $sf)
    $dateFont.Dispose()
    $dateBrush.Dispose()

    $sf.Dispose()
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()

    Write-Host "Generated: $Path"
}

# 1. Couple Images
Create-ArtImage "images/couple/groom.jpg" 800 1000 "The Groom" "Alexander Christian Hayes" "Architect of Dreams & True Devotion" ([System.Drawing.Color]::FromArgb(248, 243, 236)) ([System.Drawing.Color]::FromArgb(218, 202, 185))
Create-ArtImage "images/couple/bride.jpg" 800 1000 "The Bride" "Sophia Isabella Vance" "Grace, Radiance & Everlasting Bloom" ([System.Drawing.Color]::FromArgb(253, 246, 242)) ([System.Drawing.Color]::FromArgb(235, 209, 198))
Create-ArtImage "images/couple/couple-hero.jpg" 1200 800 "Wedding Celebration" "Alexander & Sophia" "Two Hearts Bound in Eternal Harmony" ([System.Drawing.Color]::FromArgb(250, 244, 235)) ([System.Drawing.Color]::FromArgb(215, 195, 175))

# 2. Gallery Images
Create-ArtImage "images/gallery/photo1.jpg" 800 1000 "Pre-Wedding" "Golden Hour Glow" "Sunset across the coastal bluffs" ([System.Drawing.Color]::FromArgb(255, 247, 235)) ([System.Drawing.Color]::FromArgb(230, 200, 168))
Create-ArtImage "images/gallery/photo2.jpg" 800 1000 "Engagement" "A Gentle Whisper" "Under the ancient olive groves" ([System.Drawing.Color]::FromArgb(246, 242, 235)) ([System.Drawing.Color]::FromArgb(215, 205, 190))
Create-ArtImage "images/gallery/photo3.jpg" 800 1000 "Pre-Wedding" "Lakeside Romance" "Gentle ripples and endless skies" ([System.Drawing.Color]::FromArgb(240, 245, 248)) ([System.Drawing.Color]::FromArgb(198, 212, 222))
Create-ArtImage "images/gallery/photo4.jpg" 800 1000 "Moments" "Hand in Hand" "Walking into the light together" ([System.Drawing.Color]::FromArgb(252, 244, 240)) ([System.Drawing.Color]::FromArgb(226, 204, 194))
Create-ArtImage "images/gallery/photo5.jpg" 800 1000 "Moments" "Laughter in the Sun" "Candid joy in Paris" ([System.Drawing.Color]::FromArgb(254, 249, 240)) ([System.Drawing.Color]::FromArgb(235, 215, 188))
Create-ArtImage "images/gallery/photo6.jpg" 800 1000 "Engagement" "The Engagement Ring" "A promise etched in diamonds" ([System.Drawing.Color]::FromArgb(245, 244, 248)) ([System.Drawing.Color]::FromArgb(212, 206, 222))
Create-ArtImage "images/gallery/photo7.jpg" 800 1000 "Pre-Wedding" "Dance Under the Stars" "Slow waltz in the courtyard" ([System.Drawing.Color]::FromArgb(238, 236, 242)) ([System.Drawing.Color]::FromArgb(190, 182, 202))
Create-ArtImage "images/gallery/photo8.jpg" 800 1000 "Engagement" "Promise of Eternity" "Forever begins today" ([System.Drawing.Color]::FromArgb(252, 246, 242)) ([System.Drawing.Color]::FromArgb(228, 208, 196))

# 3. Paper Texture (PNG)
$texBmp = [System.Drawing.Bitmap]::new(300, 300)
$rand = [System.Random]::new(42)
for ($x = 0; $x -lt 300; $x++) {
    for ($y = 0; $y -lt 300; $y++) {
        $n = $rand.Next(-5, 6)
        $r = [Math]::Max(0, [Math]::Min(255, 252 + $n))
        $g = [Math]::Max(0, [Math]::Min(255, 249 + $n))
        $b = [Math]::Max(0, [Math]::Min(255, 245 + $n))
        $texBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
    }
}
$texBmp.Save("images/backgrounds/paper-texture.png", [System.Drawing.Imaging.ImageFormat]::Png)
$texBmp.Dispose()
Write-Host "Generated: images/backgrounds/paper-texture.png"
