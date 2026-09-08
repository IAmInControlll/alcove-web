# Edits the user's real personal backup to clean it up for screenshots:
# - Removes test/junk folders (Testyd, etc.)
# - Adds a junction folder (for folders.png - shows junction distinction)
# - Adds a peek-able text file tile (for peek.png)
# - Reorganises root positions into a clean grid layout
# - Cleans up stale positions and folder colors
#
# Run:  powershell -ExecutionPolicy Bypass -File edit-backup.ps1

$ErrorActionPreference = 'Stop'

$srcPath = 'C:\Users\Mohammad\Documents\Projects\Alcove\cleanlaunch-plans\To Do\Alcove-Backup-2026-08-16-221629.alcove-backup'
$outPath = 'C:\Users\Mohammad\Documents\mock-workspace.alcove-backup'
$staging = Join-Path $env:TEMP "alcove-edit-$([System.IO.Path]::GetRandomFileName())"
$mockDir = Join-Path $env:PUBLIC 'Documents\Alcove Mock'

Add-Type -AssemblyName System.IO.Compression.FileSystem

# ---------- extract original backup ----------

New-Item -ItemType Directory -Path $staging -Force | Out-Null
[System.IO.Compression.ZipFile]::ExtractToDirectory($srcPath, $staging)

$shortcuts = Join-Path $staging 'shortcuts'

# ---------- remove test/junk folders ----------

$junkFolders = @('Testyd', 'Testy', 'Gamess', 'Toolss', 'dsadasdsadas')
foreach ($j in $junkFolders) {
    $p = Join-Path $shortcuts $j
    if (Test-Path $p) { Remove-Item $p -Recurse -Force }
}

# ---------- create peek-able text file ----------

if (-not (Test-Path $mockDir)) { New-Item -ItemType Directory -Path $mockDir -Force | Out-Null }

$peekFile = Join-Path $mockDir 'why-alcove.txt'
@(
    'Why Alcove?'
    ''
    'You could keep minimising windows to find your desktop.'
    'You could keep pinning things to a taskbar that''s already full.'
    'You could keep using the Start menu''s "recently added" list'
    'to find the app you installed last week.'
    ''
    'Or you could just have a place for your stuff.'
    ''
    'Alcove is a visual workspace for Windows.'
    'You drag shortcuts, folders, and files onto a grid.'
    'You arrange them the way you actually think about them.'
    'You peek without opening. You search without digging.'
    ''
    'It''s not a launcher. It''s not a dock. It''s a space.'
    ''
    'Clear the clutter. Keep what matters close.'
) -join "`r`n" | Set-Content -Path $peekFile -Encoding UTF8

# Add a .lnk pointing to the peek file
$ws = New-Object -ComObject WScript.Shell
$lnkPath = Join-Path $shortcuts 'Why Alcove.lnk'
$sc = $ws.CreateShortcut($lnkPath)
$sc.TargetPath = $peekFile
$sc.Save()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ws) | Out-Null

# ---------- add junction folder (for folders.png) ----------

$junctionDir = Join-Path $shortcuts 'Downloads'
if (-not (Test-Path $junctionDir)) { New-Item -ItemType Directory -Path $junctionDir -Force | Out-Null }
$downloadsPath = Join-Path $env:USERPROFILE 'Downloads'

# ---------- rebuild JSON files from scratch ----------

# Read the original JSON as raw text and parse manually
$positionsRaw = [System.IO.File]::ReadAllText((Join-Path $staging 'positions.json'))
$folderColorsRaw = [System.IO.File]::ReadAllText((Join-Path $staging 'folder_colors.json'))
$launchStatsRaw = [System.IO.File]::ReadAllText((Join-Path $staging 'launch_stats.json'))
$searchHistoryRaw = [System.IO.File]::ReadAllText((Join-Path $staging 'search_history.json'))

# Parse as PSCustomObject
$positionsObj = $positionsRaw | ConvertFrom-Json
$folderColorsObj = $folderColorsRaw | ConvertFrom-Json
$launchStatsObj = $launchStatsRaw | ConvertFrom-Json
$searchHistoryObj = $searchHistoryRaw | ConvertFrom-Json

# Build new positions JSON by filtering and reorganising
# Convert PSCustomObject properties to a hashtable for easy manipulation
$positions = @{}
foreach ($prop in $positionsObj.PSObject.Properties) {
    $positions[$prop.Name] = $prop.Value
}

# Remove entries for deleted/stale folders
$stalePrefixes = @('Testy', 'Testyd', 'Gamess', 'Toolss', 'dsadasdsadas')
foreach ($key in @($positions.Keys)) {
    $remove = $false
    foreach ($prefix in $stalePrefixes) {
        if ($key -eq $prefix -or $key.StartsWith("$prefix/")) { $remove = $true; break }
    }
    if ($remove) { $positions.Remove($key) }
}

# Clear existing root positions (keys without /)
foreach ($key in @($positions.Keys)) {
    if (-not $key.Contains('/')) { $positions.Remove($key) }
}

# Reorganise root grid: folders + apps in row 0, peek tile in row 1
$rootFolders = @('Games', 'Dev', 'Monitoring', 'Tools', 'Stuff', 'Downloads')
$rootApps = @('Google Chrome.lnk', 'Steam.lnk', 'Epic Games Launcher.lnk', 'EA.lnk', 'SteelSeries GG.lnk')
$rootPeek = @('Why Alcove.lnk')

$col = 0; $row = 0; $maxCols = 10
foreach ($name in ($rootFolders + $rootApps)) {
    $positions[$name] = @($col, $row)
    $col++
    if ($col -ge $maxCols) { $col = 0; $row++ }
}
$col = 0; $row = 1
foreach ($name in $rootPeek) {
    $positions[$name] = @($col, $row)
    $col++
}

# Build new folder_colors
$folderColors = @{}
foreach ($prop in $folderColorsObj.PSObject.Properties) {
    $skip = $false
    foreach ($prefix in $stalePrefixes) {
        if ($prop.Name -eq $prefix -or $prop.Name.StartsWith("$prefix/")) { $skip = $true; break }
    }
    if (-not $skip) { $folderColors[$prop.Name] = $prop.Value }
}
$folderColors['Downloads'] = '#f97316'

# Build new launch_stats (keep existing + add peek tile)
$launchStats = @{}
foreach ($prop in $launchStatsObj.PSObject.Properties) {
    $launchStats[$prop.Name] = @{ count = $prop.Value.count; last = $prop.Value.last }
}
$now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$launchStats['Why Alcove.lnk'] = @{ count = 5; last = $now - 86400 }

# Build new search_history (add positioning entries at front)
$knowledgeEntries = @(
    @{ query = 'alcove'; last = $now - 3600 },
    @{ query = 'visual workspace'; last = $now - 86400 }
)
foreach ($entry in $searchHistoryObj.knowledge) {
    $knowledgeEntries += @{ query = $entry.query; last = $entry.last }
}
$searchHistory = @{
    knowledge = $knowledgeEntries
    google = @()
}
foreach ($entry in $searchHistoryObj.google) {
    $searchHistory.google += @{ query = $entry.query; last = $entry.last }
}

# Build new settings
$settings = @{
    window = @{ x = 120; y = 80; width = 1080; height = 680 }
    theme = 'alcove'
    hotkey = 'ctrl+space'
    reset_on_show = $false
    launch_key = 'space'
    nav_back_key = 'esc'
    opacity = 100
    tile_size = 88
    has_seen_tutorial = $true
    hide_desktop_icons = $false
    themes_expanded = $false
    dark_themes_expanded = $false
    light_themes_expanded = $false
    special_themes_expanded = $false
    audio_collapsed = $true
    power_collapsed = $true
    show_hint_rotation = $true
    show_shelf_hints = $true
    full_shutdown = $false
    peek_key = 'ctrl+p'
    shelf_key = 'ctrl+shift+space'
    shelf_positions = @{}
    shelf_preview = $true
    autostart = $false
    last_launched_version = ''
    last_seen_changelog_version = ''
}

# Build new manifest
$manifest = @{
    schema_version = 1
    app_version = '0.1.2'
    created_at = $now
    junctions = @{ Downloads = $downloadsPath }
    categories = @('settings.json', 'positions.json', 'folder_colors.json', 'launch_stats.json', 'search_history.json', 'shortcuts')
}

# ---------- write JSON back ----------

$positions | ConvertTo-Json -Depth 5 | Out-File -FilePath (Join-Path $staging 'positions.json') -Encoding UTF8 -NoNewline
$folderColors | ConvertTo-Json -Depth 5 | Out-File -FilePath (Join-Path $staging 'folder_colors.json') -Encoding UTF8 -NoNewline
$launchStats | ConvertTo-Json -Depth 5 | Out-File -FilePath (Join-Path $staging 'launch_stats.json') -Encoding UTF8 -NoNewline
$searchHistory | ConvertTo-Json -Depth 5 | Out-File -FilePath (Join-Path $staging 'search_history.json') -Encoding UTF8 -NoNewline
$settings | ConvertTo-Json -Depth 5 | Out-File -FilePath (Join-Path $staging 'settings.json') -Encoding UTF8 -NoNewline
$manifest | ConvertTo-Json -Depth 5 | Out-File -FilePath (Join-Path $staging 'manifest.json') -Encoding UTF8 -NoNewline

# ---------- re-zip ----------

if (Test-Path $outPath) { Remove-Item $outPath -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($staging, $outPath, [System.IO.Compression.CompressionLevel]::Optimal, $false)

Remove-Item $staging -Recurse -Force

Write-Host ""
Write-Host "Created: $outPath"
Write-Host ""
Write-Host "Changes from your original backup:"
Write-Host "  - Removed: Testyd and other test folders"
Write-Host "  - Added: Downloads junction -> $downloadsPath (for folders.png)"
Write-Host "  - Added: Why Alcove tile -> peek text file (for peek.png)"
Write-Host "  - Cleaned: stale positions and folder colors"
Write-Host "  - Reorganised: root grid in a clean 2-row layout"
Write-Host "  - Theme: alcove (mint on charcoal)"
Write-Host "  - Window: 1080x680"
Write-Host ""
Write-Host "Root grid:"
Write-Host "  Row 0: Games, Dev, Monitoring, Tools, Stuff, Downloads, Chrome, Steam, Epic, EA"
Write-Host "  Row 1: Why Alcove, SteelSeries GG"
