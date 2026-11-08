# Instalación por COPIA en $HOME\.claude\skills (Windows PowerShell).
# Alternativa a instalar como plugin; no uses las dos a la vez o tendrás cada skill duplicada.
$ErrorActionPreference = 'Stop'

$Raiz = Split-Path -Parent $PSScriptRoot
$Origen = Join-Path $Raiz 'plugins\mark-house\skills'
$Destino = if ($env:CLAUDE_SKILLS_DIR) { $env:CLAUDE_SKILLS_DIR } else { Join-Path $HOME '.claude\skills' }
$Fecha = Get-Date -Format 'yyyyMMdd-HHmmss'

New-Item -ItemType Directory -Force -Path $Destino | Out-Null
$Instaladas = 0
Get-ChildItem -Path $Origen -Directory | ForEach-Object {
    if (-not (Test-Path (Join-Path $_.FullName 'SKILL.md'))) { return }
    $Nombre = $_.Name
    $Objetivo = Join-Path $Destino $Nombre
    if (Test-Path $Objetivo) {
        Rename-Item -Path $Objetivo -NewName "$Nombre.bak-$Fecha"
        Write-Host "  respaldo: $Nombre -> $Nombre.bak-$Fecha"
    }
    Copy-Item -Path $_.FullName -Destination $Objetivo -Recurse
    Write-Host "  OK $Nombre"
    $Instaladas++
}
Write-Host ""
Write-Host "$Instaladas skills instaladas en $Destino"
Write-Host 'Abre Claude Code y escribe /director-creativo "tu idea" o /director-proyecto "tu idea".'
