# Captures a site screenshot of the running Alcove app and saves it next to
# this script under the exact filename the Screenshot component expects.
#
# Run:  powershell -ExecutionPolicy Bypass -File capture.ps1 -Shot grid-view
#       powershell -ExecutionPolicy Bypass -File capture.ps1 -Widen
#
# Shots (grid-view, folders, themes, peek, shelf) capture the Alcove window.
# By default it is resized and centred so the window plus -Margin of desktop is
# 16:10. With -NoResize the window is captured exactly as it is, with no margin.
# Popups (Peek, Shelf, theme picker) are included if they sit on top of the
# captured area. Hero slides are full-screen screenshots cropped by hand; see
# README.md.
#
# -Widen resizes the window to 16:10 at its current height and exits, so you
# can arrange tiles before capturing with -NoResize.
#
# The script brings Alcove to the front (and resizes it unless -NoResize), then
# counts down -Delay seconds so you can open the Peek, Shelf, or settings view
# you want. Keep focus on Alcove during the countdown, or the Shelf and Peek
# close. A resized window is restored afterwards unless -KeepSize is passed.

param(
    [ValidateSet('grid-view', 'folders', 'themes', 'peek', 'shelf')]
    [string]$Shot,
    [int]$Delay = 6,
    [int]$Margin = 40,
    [switch]$NoResize,
    [switch]$KeepSize,
    [switch]$Widen
)

$ErrorActionPreference = 'Stop'

if (-not $Shot -and -not $Widen) { throw 'Pass -Shot <name> or -Widen.' }

Add-Type -AssemblyName System.Drawing
Add-Type @'
using System;
using System.Text;
using System.Runtime.InteropServices;

public static class AlcoveCapture {
    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left, Top, Right, Bottom; }

    [StructLayout(LayoutKind.Sequential)]
    public struct MONITORINFO { public int cbSize; public RECT rcMonitor; public RECT rcWork; public uint dwFlags; }

    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")] public static extern bool SetProcessDpiAwarenessContext(IntPtr value);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc cb, IntPtr lParam);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder s, int n);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetClassName(IntPtr hWnd, StringBuilder s, int n);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool IsZoomed(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int cmd);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern void keybd_event(byte vk, byte scan, uint flags, UIntPtr extra);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT r);
    [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr hWnd, IntPtr after, int x, int y, int w, int h, uint flags);
    [DllImport("user32.dll")] public static extern IntPtr MonitorFromWindow(IntPtr hWnd, uint flags);
    [DllImport("user32.dll")] public static extern bool GetMonitorInfo(IntPtr hMon, ref MONITORINFO mi);
    [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr hWnd, int attr, out RECT r, int size);

    // The main window is the Tauri window titled "Alcove"; the Shelf is titled
    // "Shelf" and the other popups "Tauri App".
    public static IntPtr FindMainWindow(uint[] pids) {
        IntPtr found = IntPtr.Zero;
        EnumWindows(delegate (IntPtr h, IntPtr l) {
            uint pid;
            GetWindowThreadProcessId(h, out pid);
            if (Array.IndexOf(pids, pid) < 0) return true;
            StringBuilder title = new StringBuilder(256);
            StringBuilder cls = new StringBuilder(256);
            GetWindowText(h, title, 256);
            GetClassName(h, cls, 256);
            if (title.ToString() == "Alcove" && cls.ToString() == "Tauri Window") { found = h; return false; }
            return true;
        }, IntPtr.Zero);
        return found;
    }

    // The visible frame, without the invisible resize borders GetWindowRect includes.
    public static RECT VisibleBounds(IntPtr hWnd) {
        RECT r;
        if (DwmGetWindowAttribute(hWnd, 9, out r, Marshal.SizeOf(typeof(RECT))) != 0) GetWindowRect(hWnd, out r);
        return r;
    }

    public static MONITORINFO MonitorOf(IntPtr hWnd) {
        MONITORINFO mi = new MONITORINFO();
        mi.cbSize = Marshal.SizeOf(typeof(MONITORINFO));
        GetMonitorInfo(MonitorFromWindow(hWnd, 2), ref mi);
        return mi;
    }

    public static void BringToFront(IntPtr hWnd) {
        if (IsIconic(hWnd)) ShowWindow(hWnd, 9);
        // A synthetic Alt press lets a background process take the foreground.
        keybd_event(0x12, 0, 0, UIntPtr.Zero);
        keybd_event(0x12, 0, 2, UIntPtr.Zero);
        SetForegroundWindow(hWnd);
    }
}
'@

# Per-monitor DPI aware v2, so every coordinate below is in physical pixels.
[AlcoveCapture]::SetProcessDpiAwarenessContext([IntPtr](-4)) | Out-Null

$procs = @(Get-Process -Name 'alcove' -ErrorAction SilentlyContinue)
if ($procs.Count -eq 0) { throw 'Alcove is not running. Start it and show the main window first.' }

$hwnd = [AlcoveCapture]::FindMainWindow([uint32[]]($procs | ForEach-Object { $_.Id }))
if ($hwnd -eq [IntPtr]::Zero) { throw 'Could not find the Alcove main window.' }
if (-not [AlcoveCapture]::IsWindowVisible($hwnd)) { throw 'Alcove is hidden. Show it with its hotkey (default Ctrl+Space) and run again.' }

# SWP_NOZORDER | SWP_NOACTIVATE
$flags = 0x0004 -bor 0x0010

# Moves the window so its visible frame lands on the given rectangle, allowing
# for the invisible borders between the window rect and the visible frame.
function Set-VisibleBounds([int]$x, [int]$y, [int]$w, [int]$h) {
    $outer = New-Object AlcoveCapture+RECT
    [AlcoveCapture]::GetWindowRect($hwnd, [ref]$outer) | Out-Null
    $inner = [AlcoveCapture]::VisibleBounds($hwnd)
    $dl = $inner.Left - $outer.Left
    $dt = $inner.Top - $outer.Top
    $dw = ($outer.Right - $outer.Left) - ($inner.Right - $inner.Left)
    $dh = ($outer.Bottom - $outer.Top) - ($inner.Bottom - $inner.Top)
    [AlcoveCapture]::SetWindowPos($hwnd, [IntPtr]::Zero, $x - $dl, $y - $dt, $w + $dw, $h + $dh, $flags) | Out-Null
}

if ($Widen) {
    $v = [AlcoveCapture]::VisibleBounds($hwnd)
    $h = $v.Bottom - $v.Top
    $w = [int][math]::Round($h * 16 / 10)
    Set-VisibleBounds $v.Left $v.Top $w $h
    $v = [AlcoveCapture]::VisibleBounds($hwnd)
    Write-Host "Widened to $($v.Right - $v.Left) x $($v.Bottom - $v.Top)"
    return
}

function Save-Region([int]$x, [int]$y, [int]$w, [int]$h) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
        $g.CopyFromScreen($x, $y, 0, 0, (New-Object System.Drawing.Size $w, $h))
        $out = Join-Path $PSScriptRoot "$Shot.png"
        $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Host "Saved $out ($w x $h)"
    } finally {
        $g.Dispose()
        $bmp.Dispose()
    }
}

function Wait-Countdown {
    for ($i = $Delay; $i -gt 0; $i--) {
        Write-Host "Capturing in $i..."
        Start-Sleep -Seconds 1
    }
}

[AlcoveCapture]::BringToFront($hwnd)
$mon = [AlcoveCapture]::MonitorOf($hwnd)

if ($NoResize) {
    Wait-Countdown
    $v = [AlcoveCapture]::VisibleBounds($hwnd)
    Save-Region $v.Left $v.Top ($v.Right - $v.Left) ($v.Bottom - $v.Top)
    return
}

$work = $mon.rcWork
$ww = $work.Right - $work.Left
$wh = $work.Bottom - $work.Top

$cw = [int][math]::Floor([math]::Min($ww * 0.9, $wh * 0.9 * 16 / 10))
$ch = [int][math]::Round($cw * 10 / 16)
$cx = $work.Left + [int](($ww - $cw) / 2)
$cy = $work.Top + [int](($wh - $ch) / 2)

$original = New-Object AlcoveCapture+RECT
[AlcoveCapture]::GetWindowRect($hwnd, [ref]$original) | Out-Null
if ([AlcoveCapture]::IsZoomed($hwnd)) { [AlcoveCapture]::ShowWindow($hwnd, 9) | Out-Null }

Set-VisibleBounds ($cx + $Margin) ($cy + $Margin) ($cw - 2 * $Margin) ($ch - 2 * $Margin)

try {
    Wait-Countdown
    Save-Region $cx $cy $cw $ch
} finally {
    if (-not $KeepSize) {
        [AlcoveCapture]::SetWindowPos($hwnd, [IntPtr]::Zero, $original.Left, $original.Top,
            $original.Right - $original.Left, $original.Bottom - $original.Top, $flags) | Out-Null
    }
}
