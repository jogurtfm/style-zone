$ErrorActionPreference = 'Stop'
$styleRoot = $PSScriptRoot
$styleConfig = Join-Path $styleRoot '.local\config.json'
if (-not (Test-Path -LiteralPath $styleConfig)) { throw 'Run the local setup command from README.md first.' }
$styleNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
if (-not (Test-Path -LiteralPath $styleNode)) { $styleNode = (Get-Command node.exe -ErrorAction Stop).Source }
$styleRunning = $false
try { $styleHealth = Invoke-RestMethod -Uri 'http://127.0.0.1:8790/api/health' -TimeoutSec 2; $styleRunning = $styleHealth.app -eq 'style-zone' } catch { }
if (-not $styleRunning) {
    Start-Process -FilePath $styleNode -ArgumentList @('scripts/server.mjs') -WorkingDirectory $styleRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $styleRoot '.local\server.log') -RedirectStandardError (Join-Path $styleRoot '.local\server-error.log') | Out-Null
    for ($styleAttempt = 0; $styleAttempt -lt 30; $styleAttempt++) {
        Start-Sleep -Milliseconds 200
        try { $styleHealth = Invoke-RestMethod -Uri 'http://127.0.0.1:8790/api/health' -TimeoutSec 1; if ($styleHealth.app -eq 'style-zone') { $styleRunning = $true; break } } catch { }
    }
}
if (-not $styleRunning) { throw 'The local wardrobe server could not start. See .local/server-error.log.' }
Start-Process 'http://127.0.0.1:8790'
