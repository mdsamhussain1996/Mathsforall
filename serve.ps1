$root = 'c:\Users\mdsam\OneDrive\Desktop\Maths_for_Everyone'
$port = 3456
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "✅ Server running at http://localhost:$port" -ForegroundColor Green
Write-Host "   Press Ctrl+C to stop." -ForegroundColor Gray

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.png'  = 'image/png'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
}

try {
    while ($listener.IsListening) {
        $ctx  = $listener.GetContext()
        $req  = $ctx.Request
        $res  = $ctx.Response
        $urlPath = $req.Url.LocalPath
        if ($urlPath -eq '/') { $urlPath = '/index.html' }
        $filePath = Join-Path $root ($urlPath.TrimStart('/').Replace('/', '\'))
        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "  200  $urlPath" -ForegroundColor Cyan
        } else {
            $res.StatusCode = 404
            $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $res.ContentLength64 = $body.Length
            $res.OutputStream.Write($body, 0, $body.Length)
            Write-Host "  404  $urlPath" -ForegroundColor Yellow
        }
        $res.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}
