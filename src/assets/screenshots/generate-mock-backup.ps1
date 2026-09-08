# Generates mock-workspace.alcove-backup - a workspace snapshot designed for
# screenshot production AND exploration. Import it via Settings > Import backup.
#
# Run:  powershell -ExecutionPolicy Bypass -File generate-mock-backup.ps1
#
# The workspace is built from REAL apps installed on this machine, so icons
# extract cleanly and the grid looks like a workspace someone actually uses.
# Steam/Epic .url shortcuts are used for games (always resolve, show game
# icons). Peek-able .txt files add personality for anyone who explores.
# Uses only apps that exist on the machine; missing apps are skipped silently.

$ErrorActionPreference = 'Stop'

$scriptDir   = $PSScriptRoot
$outputPath  = Join-Path $scriptDir 'mock-workspace.alcove-backup'
$staging     = Join-Path $env:TEMP "alcove-mock-$([System.IO.Path]::GetRandomFileName())"
$shortcuts   = Join-Path $staging 'shortcuts'
$mockDir     = Join-Path $env:PUBLIC 'Documents\Alcove Mock'

New-Item -ItemType Directory -Path $shortcuts -Force | Out-Null
if (-not (Test-Path $mockDir)) { New-Item -ItemType Directory -Path $mockDir -Force | Out-Null }

# ---------- helpers ----------

function New-Lnk($dir, $name, $target) {
    if (-not (Test-Path $target)) { return $false }
    $ws = New-Object -ComObject WScript.Shell
    $path = Join-Path $dir "$name.lnk"
    $sc = $ws.CreateShortcut($path)
    $sc.TargetPath = $target
    $sc.Save()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ws) | Out-Null
    return $true
}

function New-Url($dir, $name, $url) {
    $path = Join-Path $dir "$name.url"
    "[InternetShortcut]`r`nURL=$url" | Set-Content -Path $path -Encoding ASCII
}

function Write-Json($fileName, $json) {
    [System.IO.File]::WriteAllText((Join-Path $staging $fileName), $json)
}

function Write-Txt($fileName, $lines) {
    $path = Join-Path $mockDir $fileName
    ($lines -join "`r`n") + "`r`n" | Set-Content -Path $path -Encoding UTF8
}

function Find-App($names) {
    foreach ($n in $names) {
        if (Test-Path $n) { return $n }
    }
    return $null
}

# ---------- detect installed apps ----------

$apps = @{}

$apps.Chrome       = Find-App @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$apps.Steam        = Find-App @(
    "${env:ProgramFiles(x86)}\Steam\Steam.exe",
    "$env:ProgramFiles\Steam\Steam.exe",
    "D:\Steam\Steam.exe"
)
$apps.Epic         = Find-App @(
    "${env:ProgramFiles(x86)}\Epic Games\Launcher\Portal\Binaries\Win64\EpicGamesLauncher.exe",
    "${env:ProgramFiles(x86)}\Epic Games\Launcher\Portal\Binaries\Win32\EpicGamesLauncher.exe"
)
$apps.EA           = Find-App @(
    "$env:ProgramFiles\Electronic Arts\EA Desktop\EA Desktop\EALauncher.exe",
    "${env:ProgramFiles(x86)}\Origin\Origin.exe"
)
$apps.Discord      = Find-App @(
    "$env:LOCALAPPDATA\Discord\app.exe",
    "${env:ProgramFiles(x86)}\Discord\Discord.exe"
)
$apps.Spotify      = Find-App @(
    "$env:APPDATA\Spotify\Spotify.exe",
    "$env:LOCALAPPDATA\Spotify\Spotify.exe",
    "${env:ProgramFiles(x86)}\Spotify\Spotify.exe"
)
$apps.VSCode       = Find-App @(
    "$env:LOCALAPPDATA\Programs\Microsoft VS Code\Code.exe",
    "${env:ProgramFiles(x86)}\Microsoft VS Code\Code.exe",
    "$env:ProgramFiles\Microsoft VS Code\Code.exe"
)
$apps.GitBash      = Find-App @(
    "$env:ProgramFiles\Git\git-bash.exe",
    "${env:ProgramFiles(x86)}\Git\git-bash.exe"
)
$apps.GitHubDesk   = Find-App @(
    "$env:LOCALAPPDATA\GitHubDesktop\GitHubDesktop.exe",
    "${env:ProgramFiles}\GitHub Desktop\GitHubDesktop.exe"
)
$apps.Devin        = Find-App @(
    "$env:LOCALAPPDATA\Programs\Devin\Devin.exe"
)
$apps.Notepad      = Find-App @("$env:SystemRoot\System32\notepad.exe")
$apps.Paint        = Find-App @("$env:SystemRoot\System32\mspaint.exe")
$apps.Terminal     = Find-App @("$env:SystemRoot\System32\cmd.exe")
$apps.Explorer     = Find-App @("$env:SystemRoot\explorer.exe")
$apps.Calc         = Find-App @("$env:SystemRoot\System32\calc.exe")
$apps.Settings     = Find-App @("$env:SystemRoot\System32\control.exe")
$apps.TaskMgr      = Find-App @("$env:SystemRoot\System32\Taskmgr.exe")
$apps.Snipping     = Find-App @("$env:SystemRoot\System32\SnippingTool.exe")
$apps.WordPad      = Find-App @("$env:SystemRoot\System32\write.exe")
$apps.CharMap      = Find-App @("$env:SystemRoot\System32\charmap.exe")

# Hardware/monitoring tools (only if installed)
$apps.MSIAfterburner = Find-App @("${env:ProgramFiles(x86)}\MSI Afterburner\MSIAfterburner.exe")
$apps.HWiNFO       = Find-App @("$env:ProgramFiles\HWiNFO64\HWiNFO64.EXE")
$apps.CPUZ         = Find-App @("$env:ProgramFiles\CPUID\CPU-Z MSI\cpuz.exe", "${env:ProgramFiles(x86)}\CPUID\CPU-Z\cpuz.exe")
$apps.NVIDIAApp    = Find-App @("$env:ProgramFiles\NVIDIA Corporation\NVIDIA App\CEF\NVIDIA App.exe")
$apps.Speccy       = Find-App @("$env:ProgramFiles\Speccy\Speccy64.exe")
$apps.iCUE         = Find-App @("$env:ProgramFiles\Corsair\Corsair iCUE5 Software\iCUE.exe")
$apps.LGHUB        = Find-App @("$env:ProgramFiles\LGHUB\system_tray\lghub_system_tray.exe")
$apps.SteelSeries  = Find-App @("$env:ProgramFiles\SteelSeries\GG\SteelSeriesGGEZ.exe")
$apps.MSICenter    = Find-App @("$env:ProgramFiles\MSI Center\MSICenter.exe")

Write-Host "Detected apps:"
foreach ($key in $apps.Keys | Sort-Object) {
    if ($apps[$key]) { Write-Host "  [OK] $key -> $($apps[$key])" }
}

# ---------- peek-able text files ----------

Write-Txt 'why-alcove.txt' @(
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
)

Write-Txt 'tips.txt' @(
    'Alcove - Quick Tips'
    ''
    'DRAG     Drop .lnk, .url, or .exe files onto the window.'
    'PEEK     Hold Ctrl+P on any tile to preview without opening.'
    'SEARCH   Ctrl+Shift+Space opens the Shelf.'
    'FOLDERS  Drag a folder in - it becomes a junction, not a copy.'
    'COLOURS  Right-click a folder to colour it.'
    'THEMES   Pick a theme in Settings. There are 20+.'
    'HOTKEY   Ctrl+Space shows and hides the workspace.'
    ''
    'Folders are real Windows junctions.'
    'Delete a tile and the original file is untouched.'
)

Write-Txt 'readme.txt' @(
    'Hello.'
    ''
    'You found me. I''m the readme file in the mock workspace.'
    ''
    'If you''re reading this, you either peeked me (good instinct)'
    'or opened me in Notepad (also valid).'
    ''
    'This workspace was set up for screenshots, but everything in'
    'it works. The shortcuts launch. The folders open. The peek'
    'shows real text. That''s kind of the whole point.'
    ''
    'Alcove doesn''t copy your files. It arranges them.'
    'Every tile here is a real shortcut to a real thing.'
    ''
    'Anyway. Welcome to Alcove. Make it yours.'
)

Write-Txt 'fix_later.txt' @(
    '// TODO: fix this later'
    '//'
    '// Note to self: this "sh" file is actually a shortcut'
    '// to this text file. Alcove doesn''t care about the'
    '// extension - it just shows what you dragged in.'
    '//'
    '// The real question is: when is "later"?'
)

Write-Txt 'it_works.txt' @(
    '// DO NOT TOUCH'
    '//'
    '// I don''t know why this works.'
    '// I don''t know what it does.'
    '// I know only that if I change it,'
    '// everything breaks.'
    '//'
    '// (It''s a shortcut to Notepad. It doesn''t do anything.'
    '//  But the principle stands.)'
)

Write-Txt 'not_a_game.txt' @(
    'This is definitely not a game.'
    ''
    '(It''s a command prompt. But don''t tell anyone.)'
)

Write-Txt 'final.txt' @(
    'Final.docx'
    'Final_v2.docx'
    'Final_v2_FINAL.docx'
    'Final_v2_FINAL_REALLY_FINAL.docx'
    'Final_v2_FINAL_REALLY_FINAL_this_is_it.docx'
    'Final_v2_FINAL_REALLY_FINAL_this_is_it_I_mean_it.docx'
    ''
    '...you get the idea.'
    ''
    'This is a shortcut. It launches Notepad.'
    'The filename is the joke.'
)

Write-Txt 'do_not_delete.txt' @(
    'I said don''t delete.'
    ''
    'This is a shortcut to Notepad.'
    'There''s nothing to delete. The original file is safe.'
    ''
    'That''s the beauty of Alcove - deleting a tile'
    'only removes the shortcut, never the original.'
)

# ---------- build root grid ----------

# Track what we actually created for positions
$rootItems = @()
$folderItems = @{}

# Folders (always created)
$rootFolders = @(
    @{ Name = 'Daily';     Color = '#22c55e' },
    @{ Name = 'Projects';  Color = '#3b82f6' },
    @{ Name = 'Creative';  Color = '#a855f7' },
    @{ Name = 'Games';     Color = '#f97316' }
)
foreach ($f in $rootFolders) {
    New-Item -ItemType Directory -Path (Join-Path $shortcuts $f.Name) -Force | Out-Null
    $rootItems += $f.Name
    $folderItems[$f.Name] = @()
}

# Root apps - pick from what's installed, prioritise the most recognisable
$rootAppCandidates = @(
    @{ Name = 'Chrome';    App = 'Chrome' },
    @{ Name = 'Steam';     App = 'Steam' },
    @{ Name = 'Discord';   App = 'Discord' },
    @{ Name = 'Spotify';   App = 'Spotify' },
    @{ Name = 'Epic Games'; App = 'Epic' },
    @{ Name = 'EA';        App = 'EA' },
    @{ Name = 'Terminal';  App = 'Terminal' },
    @{ Name = 'Explorer';  App = 'Explorer' },
    @{ Name = 'Settings';  App = 'Settings' },
    @{ Name = 'Task Manager'; App = 'TaskMgr' }
)

foreach ($c in $rootAppCandidates) {
    $target = $apps[$c.App]
    if (-not $target) { continue }
    if ((New-Lnk $shortcuts $c.Name $target)) {
        $rootItems += "$($c.Name).lnk"
    }
}

# Root web shortcuts
New-Url $shortcuts 'Search'  'https://www.bing.com'
$rootItems += 'Search.url'
New-Url $shortcuts 'Weather' 'https://weather.com'
$rootItems += 'Weather.url'

# Root peek-able tiles (always created, point to .txt files)
New-Lnk $shortcuts 'Why Alcove' (Join-Path $mockDir 'why-alcove.txt')
$rootItems += 'Why Alcove.lnk'
New-Lnk $shortcuts 'Tips'       (Join-Path $mockDir 'tips.txt')
$rootItems += 'Tips.lnk'
New-Lnk $shortcuts 'Read Me'    (Join-Path $mockDir 'readme.txt')
$rootItems += 'Read Me.lnk'

# ---------- folder contents ----------

# Daily - web shortcuts (always work)
$daily = Join-Path $shortcuts 'Daily'
New-Url $daily 'Calendar' 'https://calendar.live.com'
$folderItems['Daily'] += 'Calendar.url'
New-Url $daily 'Mail'    'https://outlook.live.com'
$folderItems['Daily'] += 'Mail.url'
New-Url $daily 'Weather' 'https://weather.com'
$folderItems['Daily'] += 'Weather.url'
if ($apps.WordPad) {
    New-Lnk $daily 'WordPad' $apps.WordPad
    $folderItems['Daily'] += 'WordPad.lnk'
}

# Projects - dev tools + 1 joke
$projects = Join-Path $shortcuts 'Projects'
if ($apps.VSCode) {
    New-Lnk $projects 'VS Code' $apps.VSCode
    $folderItems['Projects'] += 'VS Code.lnk'
}
if ($apps.GitBash) {
    New-Lnk $projects 'Git Bash' $apps.GitBash
    $folderItems['Projects'] += 'Git Bash.lnk'
}
if ($apps.GitHubDesk) {
    New-Lnk $projects 'GitHub Desktop' $apps.GitHubDesk
    $folderItems['Projects'] += 'GitHub Desktop.lnk'
}
if ($apps.Devin) {
    New-Lnk $projects 'Devin' $apps.Devin
    $folderItems['Projects'] += 'Devin.lnk'
}
# Joke tile (always created)
New-Lnk $projects 'fix_later.sh' (Join-Path $mockDir 'fix_later.txt')
$folderItems['Projects'] += 'fix_later.sh.lnk'
New-Url $projects 'Reference' 'https://en.wikipedia.org'
$folderItems['Projects'] += 'Reference.url'

# Creative - tools + 1 joke
$creative = Join-Path $shortcuts 'Creative'
if ($apps.Paint) {
    New-Lnk $creative 'Paint' $apps.Paint
    $folderItems['Creative'] += 'Paint.lnk'
}
if ($apps.CharMap) {
    New-Lnk $creative 'Character Map' $apps.CharMap
    $folderItems['Creative'] += 'Character Map.lnk'
}
if ($apps.Snipping) {
    New-Lnk $creative 'Snipping Tool' $apps.Snipping
    $folderItems['Creative'] += 'Snipping Tool.lnk'
}
# Joke tile
New-Lnk $creative 'it_works_do_not_touch.js' (Join-Path $mockDir 'it_works.txt')
$folderItems['Creative'] += 'it_works_do_not_touch.js.lnk'

# Games - Steam .url shortcuts (always work, show game icons)
# Plus joke tiles
$games = Join-Path $shortcuts 'Games'

$steamGames = @(
    @{ Name = 'Cyberpunk 2077';         Url = 'steam://rungameid/1091500' },
    @{ Name = 'Elden Ring';             Url = 'steam://rungameid/1245620' },
    @{ Name = 'Stardew Valley';         Url = 'steam://rungameid/413150' },
    @{ Name = 'Portal 2';               Url = 'steam://rungameid/620' },
    @{ Name = 'Terraria';               Url = 'steam://rungameid/105600' },
    @{ Name = 'Dead Space';             Url = 'steam://rungameid/1693980' },
    @{ Name = 'Pacific Drive';          Url = 'steam://rungameid/1458140' },
    @{ Name = 'BeamNG.drive';           Url = 'steam://rungameid/284160' }
)

# Pick 6 games for a clean grid
$selectedGames = $steamGames | Select-Object -First 6
foreach ($g in $selectedGames) {
    New-Url $games $g.Name $g.Url
    $folderItems['Games'] += "$($g.Name).url"
}

# Joke tiles in Games
New-Lnk $games 'definitely_not_a_game' (Join-Path $mockDir 'not_a_game.txt')
$folderItems['Games'] += 'definitely_not_a_game.lnk'
New-Lnk $games 'Final_v2_FINAL.docx' (Join-Path $mockDir 'final.txt')
$folderItems['Games'] += 'Final_v2_FINAL.docx.lnk'

# Saves subfolder (inside Games)
New-Item -ItemType Directory -Path (Join-Path $games 'Saves') -Force | Out-Null
$folderItems['Games'] += 'Saves'
$folderItems['Games/Saves'] = @()

$saves = Join-Path $games 'Saves'
if ($apps.Notepad) {
    New-Lnk $saves 'last_save'  $apps.Notepad
    $folderItems['Games/Saves'] += 'last_save.lnk'
    New-Lnk $saves 'older_save' $apps.Notepad
    $folderItems['Games/Saves'] += 'older_save.lnk'
}
New-Lnk $saves 'DO_NOT_DELETE' (Join-Path $mockDir 'do_not_delete.txt')
$folderItems['Games/Saves'] += 'DO_NOT_DELETE.lnk'

# ---------- JSON state files ----------

$now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$recent  = $now - 3600
$earlier = $now - 86400
$weekAgo = $now - 604800

# settings.json
Write-Json 'settings.json' @"
{
  "window": { "x": 120, "y": 80, "width": 1080, "height": 680 },
  "theme": "alcove",
  "hotkey": "ctrl+space",
  "reset_on_show": false,
  "launch_key": "space",
  "nav_back_key": "esc",
  "opacity": 100,
  "tile_size": 88,
  "has_seen_tutorial": true,
  "hide_desktop_icons": false,
  "themes_expanded": false,
  "dark_themes_expanded": false,
  "light_themes_expanded": false,
  "special_themes_expanded": false,
  "audio_collapsed": true,
  "power_collapsed": true,
  "show_hint_rotation": true,
  "show_shelf_hints": true,
  "full_shutdown": false,
  "peek_key": "ctrl+p",
  "shelf_key": "ctrl+shift+space",
  "shelf_positions": {},
  "shelf_preview": true,
  "autostart": false,
  "last_launched_version": "",
  "last_seen_changelog_version": ""
}
"@

# positions.json - auto-generated from what we actually created
$posLines = @()
$col = 0
$row = 0
$maxCols = 10

# Root items: folders first, then apps, then web, then peek-able
$rootFolders_only = $rootItems | Where-Object { $_ -notmatch '\.' }
$rootApps_only = $rootItems | Where-Object { $_ -match '\.lnk$' -and $_ -notmatch '(Why Alcove|Tips|Read Me)' }
$rootWeb_only = $rootItems | Where-Object { $_ -match '\.url$' }
$rootPeek_only = $rootItems | Where-Object { $_ -match '(Why Alcove|Tips|Read Me)' }

$col = 0; $row = 0
foreach ($name in ($rootFolders_only + $rootApps_only)) {
    $posLines += "  `"$name`": [$col, $row],"
    $col++
    if ($col -ge $maxCols) { $col = 0; $row++ }
}
if ($col -gt 0 -or $row -gt 0) { $col = 0; $row++ }
foreach ($name in ($rootWeb_only + $rootPeek_only)) {
    $posLines += "  `"$name`": [$col, $row],"
    $col++
    if ($col -ge $maxCols) { $col = 0; $row++ }
}

# Folder contents: each folder starts at [0, 0]
foreach ($folderName in $folderItems.Keys) {
    $col = 0; $row = 0
    foreach ($name in $folderItems[$folderName]) {
        $key = if ($folderName -eq '') { $name } else { "$folderName/$name" }
        $posLines += "  `"$key`": [$col, $row],"
        $col++
        if ($col -ge $maxCols) { $col = 0; $row++ }
    }
}

# Remove trailing comma from last line
if ($posLines.Count -gt 0) {
    $posLines[-1] = $posLines[-1] -replace ',$', ''
}

$positionsJson = "{`n" + ($posLines -join "`n") + "`n}"
Write-Json 'positions.json' $positionsJson

# folder_colors.json
$colorEntries = @()
foreach ($f in $rootFolders) {
    $colorEntries += @{ Key = $f.Name; Color = $f.Color }
}
$colorEntries += @{ Key = 'Games/Saves'; Color = '#ef4444' }
$colorLines = @()
for ($i = 0; $i -lt $colorEntries.Count; $i++) {
    $comma = if ($i -lt $colorEntries.Count - 1) { ',' } else { '' }
    $colorLines += "  `"$($colorEntries[$i].Key)`": `"$($colorEntries[$i].Color)`"$comma"
}
$colorsJson = "{`n" + ($colorLines -join "`n") + "`n}"
Write-Json 'folder_colors.json' $colorsJson

# launch_stats.json - tells a story
$statsLines = @()
$statsLines += "  `"Why Alcove.lnk`": { `"count`": 19, `"last`": $earlier },"
$statsLines += "  `"Search.url`": { `"count`": 42, `"last`": $recent },"
$statsLines += "  `"Tips.lnk`": { `"count`": 3, `"last`": $weekAgo },"
$statsLines += "  `"Read Me.lnk`": { `"count`": 1, `"last`": $weekAgo },"
$statsLines += "  `"Daily`": { `"count`": 28, `"last`": $recent },"
$statsLines += "  `"Games`": { `"count`": 15, `"last`": $earlier },"
$statsLines += "  `"Games/definitely_not_a_game.lnk`": { `"count`": 37, `"last`": $recent },"
$statsLines += "  `"Projects`": { `"count`": 15, `"last`": $earlier }"
$statsJson = "{`n" + ($statsLines -join "`n") + "`n}"
Write-Json 'launch_stats.json' $statsJson

# search_history.json
Write-Json 'search_history.json' @"
{
  "knowledge": [
    { "query": "alcove", "last": $recent },
    { "query": "visual workspace", "last": $earlier },
    { "query": "desktop organiser", "last": $weekAgo }
  ],
  "google": [
    { "query": "how to clean up desktop", "last": $earlier },
    { "query": "windows shortcut manager", "last": $weekAgo }
  ]
}
"@

# manifest.json
Write-Json 'manifest.json' @"
{
  "schema_version": 1,
  "app_version": "0.1.2",
  "created_at": $now,
  "junctions": {},
  "categories": [
    "settings.json",
    "positions.json",
    "folder_colors.json",
    "launch_stats.json",
    "search_history.json",
    "shortcuts"
  ]
}
"@

# ---------- zip into .alcove-backup ----------

Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path $outputPath) { Remove-Item $outputPath -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($staging, $outputPath, [System.IO.Compression.CompressionLevel]::Optimal, $false)

Remove-Item $staging -Recurse -Force

Write-Host ""
Write-Host "Created: $outputPath"
Write-Host ""
Write-Host "Import it in Alcove: Settings > Import backup"
Write-Host "Peek-able text files at: $mockDir"
Write-Host ""
Write-Host "Root grid ($($rootItems.Count) tiles):"
foreach ($item in $rootItems) { Write-Host "  $item" }
Write-Host ""
foreach ($folderName in ($folderItems.Keys | Sort-Object)) {
    Write-Host "$folderName ($($folderItems[$folderName].Count) items):"
    foreach ($item in $folderItems[$folderName]) { Write-Host "  $item" }
    Write-Host ""
}
