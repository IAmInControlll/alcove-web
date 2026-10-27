const iconFiles = import.meta.glob<string>('../assets/demo-icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const demoIcon = (name: string): string | undefined => iconFiles[`../assets/demo-icons/${name}.png`];

export type Cell = [col: number, row: number];

interface DemoBase {
  id: string;
  label: string;
  cell: Cell;
  recent: string;
}

export interface DemoApp extends DemoBase {
  kind: 'app';
  icon: string;
  type: string;
  target: string;
}

export interface DemoFile extends DemoBase {
  kind: 'file';
  icon: string;
  size: string;
  path: string;
  body: string;
}

export interface DemoFolder extends DemoBase {
  kind: 'folder';
  color: string;
  items: (DemoApp | DemoFile)[];
}

export type DemoItem = DemoApp | DemoFile | DemoFolder;

export const DEMO_TILE = 88;
export const DEMO_TILE_COMPACT = 72;

export const demoHotkeys = {
  window: ['Ctrl', 'Space'],
  shelf: ['Ctrl', 'Shift', 'Space'],
};

export const demoHints = {
  start: 'Drag a tile somewhere else. It stays there.',
  moved: 'Moved. It stays there until you move it again.',
  blocked: 'Something is already there. Pick an empty spot.',
  folder: 'Real folders come in as junctions, so nothing gets copied.',
  peek: 'Peek shows what is inside without opening its app. Ctrl+P does it too.',
  launch: (name: string) => `${name} would open now. This one is a demo.`,
  theme: (name: string) => `${name}. The whole page changed with it.`,
  muted: 'Muted. Expand the group for the per-app mixer.',
  power: 'Power actions ask before they do anything.',
  search: 'Press Ctrl+F to jump to search',
};

export const demoHome: DemoItem[] = [
  { id: 'this-pc', kind: 'app', label: 'This PC', icon: 'this-pc', type: 'System folder', target: 'This PC', cell: [0, 0], recent: 'Home - Aug 9, 2026' },
  {
    id: 'tools',
    kind: 'folder',
    label: 'Tools',
    color: '#22c55e',
    cell: [1, 0],
    recent: 'Home - 2h ago',
    items: [
      { id: 'terminal', kind: 'app', label: 'Terminal', icon: 'terminal', type: 'Store App', target: 'Windows Terminal', cell: [0, 0], recent: 'Tools - 1h ago' },
      { id: 'notepad', kind: 'app', label: 'Notepad', icon: 'notepad', type: 'Store App', target: 'Notepad', cell: [1, 0], recent: 'Tools - Aug 11, 2026' },
      { id: 'calculator', kind: 'app', label: 'Calculator', icon: 'calculator', type: 'Store App', target: 'Calculator', cell: [2, 0], recent: 'Tools - Aug 12, 2026' },
      { id: 'paint', kind: 'app', label: 'Paint', icon: 'paint', type: 'Store App', target: 'Paint', cell: [3, 0], recent: 'Tools - Jul 30, 2026' },
      { id: 'task-manager', kind: 'app', label: 'Task Manager', icon: 'task-manager', type: 'Shortcut', target: 'Taskmgr.exe', cell: [4, 0], recent: 'Tools - Jul 2, 2026' },
    ],
  },
  {
    id: 'dev',
    kind: 'folder',
    label: 'Dev',
    color: '#a855f7',
    cell: [2, 0],
    recent: 'Home - Aug 10, 2026',
    items: [
      { id: 'github-desktop', kind: 'app', label: 'GitHub Desktop', icon: 'github-desktop', type: 'Shortcut', target: 'GitHubDesktop.exe', cell: [0, 0], recent: 'Dev - 3h ago' },
      {
        id: 'todo',
        kind: 'file',
        label: 'todo.txt',
        icon: 'text-file',
        size: '74 B',
        path: 'C:\\Users\\You\\Documents\\todo.txt',
        cell: [1, 0],
        recent: 'Dev - 20m ago',
        body: 'fix the thing\nfix the thing that fixing the thing broke\nlunch',
      },
    ],
  },
  { id: 'chrome', kind: 'app', label: 'Google Chrome', icon: 'chrome', type: 'Shortcut', target: 'chrome.exe', cell: [0, 1], recent: 'Home - 5m ago' },
  {
    id: 'media',
    kind: 'folder',
    label: 'Media',
    color: '#f97316',
    cell: [1, 1],
    recent: 'Home - Aug 8, 2026',
    items: [
      { id: 'spotify', kind: 'app', label: 'Spotify', icon: 'spotify', type: 'Store App', target: 'Spotify', cell: [0, 0], recent: 'Media - Aug 8, 2026' },
      { id: 'vlc', kind: 'app', label: 'VLC media player', icon: 'vlc', type: 'Shortcut', target: 'vlc.exe', cell: [1, 0], recent: 'Media - Jul 21, 2026' },
      { id: 'photos', kind: 'app', label: 'Photos', icon: 'photos', type: 'Store App', target: 'Photos', cell: [2, 0], recent: 'Media - Jul 3, 2026' },
    ],
  },
  { id: 'discord', kind: 'app', label: 'Discord', icon: 'discord', type: 'Shortcut', target: 'Update.exe', cell: [0, 2], recent: 'Home - 1h ago' },
  { id: 'steam', kind: 'app', label: 'Steam', icon: 'steam', type: 'Shortcut', target: 'steam.exe', cell: [1, 2], recent: 'Home - Aug 7, 2026' },
  {
    id: 'try',
    kind: 'file',
    label: 'Things to try.txt',
    icon: 'text-file',
    size: '412 B',
    path: 'C:\\Users\\You\\Desktop\\Things to try.txt',
    cell: [8, 0],
    recent: 'Home - just now',
    body: 'Drag any tile to an empty spot. It stays there.\n\nClick Tools to open it.\n\nPress Ctrl+Space to hide this window, and again to bring it back.\n\nPress Ctrl+Shift+Space for the Shelf. Type "theme" in it.\n\nThe gear in the title bar switches themes too. The whole site changes with it.',
  },
  { id: 'explorer', kind: 'app', label: 'File Explorer', icon: 'file-explorer', type: 'Shortcut', target: 'explorer.exe', cell: [8, 1], recent: 'Home - Aug 6, 2026' },
  {
    id: 'why',
    kind: 'file',
    label: 'Why Alcove.txt',
    icon: 'text-file',
    size: '605 B',
    path: 'C:\\Users\\You\\Desktop\\Why Alcove.txt',
    cell: [7, 4],
    recent: 'Home - 10m ago',
    body: "Why Alcove?\n\nYou could keep minimising windows to find your desktop.\nYou could keep pinning things to a taskbar that's already full.\nYou could keep using the Start menu's \"recently added\" list\nto find the app you installed last week.\n\nOr you could just have a place for your stuff.",
  },
  { id: 'recycle-bin', kind: 'app', label: 'Recycle Bin', icon: 'recycle-bin', type: 'System folder', target: 'Recycle Bin', cell: [8, 4], recent: 'Home - Aug 7, 2026' },
];
