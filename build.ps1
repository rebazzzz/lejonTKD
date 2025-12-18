# Build script for Lion TKD website
# This script minifies all CSS and JavaScript files

Write-Host "🔨 Building Lion TKD Website..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if tools are installed
Write-Host "🔍 Checking for required tools..." -ForegroundColor Yellow
$cleanCssInstalled = Get-Command cleancss -ErrorAction SilentlyContinue
$terserInstalled = Get-Command terser -ErrorAction SilentlyContinue

if (-not $cleanCssInstalled) {
    Write-Host "❌ clean-css-cli is not installed!" -ForegroundColor Red
    Write-Host "   Run: npm install -g clean-css-cli" -ForegroundColor Yellow
    exit 1
}

if (-not $terserInstalled) {
    Write-Host "❌ terser is not installed!" -ForegroundColor Red
    Write-Host "   Run: npm install -g terser" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ All tools are installed`n" -ForegroundColor Green

# Minify CSS
Write-Host "📦 Minifying CSS files..." -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow
cd 1/css
$cssFiles = Get-ChildItem *.css -Exclude *.min.css
$cssCount = 0
foreach ($file in $cssFiles) {
    $outputFile = "$($file.BaseName).min.css"
    cleancss -o $outputFile $file.Name 2>$null
    if ($LASTEXITCODE -eq 0) {
        $originalSize = [math]::Round($file.Length/1KB, 2)
        $minifiedSize = [math]::Round((Get-Item $outputFile).Length/1KB, 2)
        $savings = [math]::Round((($file.Length - (Get-Item $outputFile).Length) / $file.Length) * 100, 1)
        Write-Host "  ✓ $($file.Name) -> $outputFile" -ForegroundColor Green
        Write-Host "    $originalSize KB -> $minifiedSize KB (saved $savings%)" -ForegroundColor Gray
        $cssCount++
    } else {
        Write-Host "  ✗ Failed to minify $($file.Name)" -ForegroundColor Red
    }
}
Write-Host "`n✅ Minified $cssCount CSS files`n" -ForegroundColor Green

# Minify JS
Write-Host "📦 Minifying JavaScript files..." -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow
cd ../js
$jsFiles = Get-ChildItem *.js -Exclude *.min.js
$jsCount = 0
foreach ($file in $jsFiles) {
    $outputFile = "$($file.BaseName).min.js"
    terser $file.Name -o $outputFile -c -m 2>$null
    if ($LASTEXITCODE -eq 0) {
        $originalSize = [math]::Round($file.Length/1KB, 2)
        $minifiedSize = [math]::Round((Get-Item $outputFile).Length/1KB, 2)
        $savings = [math]::Round((($file.Length - (Get-Item $outputFile).Length) / $file.Length) * 100, 1)
        Write-Host "  ✓ $($file.Name) -> $outputFile" -ForegroundColor Green
        Write-Host "    $originalSize KB -> $minifiedSize KB (saved $savings%)" -ForegroundColor Gray
        $jsCount++
    } else {
        Write-Host "  ✗ Failed to minify $($file.Name)" -ForegroundColor Red
    }
}

cd ../..

Write-Host "`n✅ Minified $jsCount JavaScript files`n" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 Build complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test your website locally" -ForegroundColor White
Write-Host "  2. Check browser console for errors" -ForegroundColor White
Write-Host "  3. Deploy to production`n" -ForegroundColor White
