const iconFiles = import.meta.glob<string>('../assets/demo-icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const demoIcon = (name: string): string | undefined => iconFiles[`../assets/demo-icons/${name}.png`];

import glyphUrl from '../assets/brand/glyph.svg?url';

const pictureFiles = import.meta.glob<string>('../assets/demo-files/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});

const sitePictures: Record<string, string> = { og: '/og.png', glyph: glyphUrl };

export const demoPicture = (name: string): string | undefined =>
  sitePictures[name] ?? pictureFiles[`../assets/demo-files/${name}.svg`];

export type Cell = [col: number, row: number];

interface DemoBase {
  id: string;
  label: string;
  cell: Cell;
  compact?: Cell;
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

export interface DemoEntry {
  name: string;
  size: number;
  created: string;
  modified: string;
  entries?: DemoEntry[];
  body?: string;
  picture?: string;
}

export interface DemoFolder extends DemoBase {
  kind: 'folder';
  color?: string;
  items: (DemoApp | DemoFile | DemoFolder)[];
  link?: { path: string; entries: DemoEntry[] };
}

export type DemoItem = DemoApp | DemoFile | DemoFolder;

export const folderSwatch = (color?: string) =>
  color ? { background: `${color}33`, border: `1px solid ${color}66` } : { background: 'var(--surface)' };

export const DEMO_TILE = 88;
export const DEMO_TILE_COMPACT = 72;

export const demoHotkeys = {
  window: ['Ctrl', 'Space'],
  shelf: ['Ctrl', 'Shift', 'Space'],
  peek: ['Ctrl', 'P'],
};

export type DemoTaskId = 'drag' | 'folder' | 'nested' | 'peek' | 'hide' | 'shelf' | 'theme';

export const demoTasks: { id: DemoTaskId; label: string }[] = [
  { id: 'drag', label: 'Drag a tile somewhere else' },
  { id: 'folder', label: 'Open a folder' },
  { id: 'nested', label: 'Find a folder inside a folder' },
  { id: 'peek', label: 'Peek inside a file' },
  { id: 'hide', label: 'Hide it with Ctrl+Space' },
  { id: 'shelf', label: 'Open the Shelf' },
  { id: 'theme', label: 'Change the theme' },
];

export const demoHints = {
  start: 'Drag a tile somewhere else. It stays there.',
  moved: 'Moved. It stays there until you move it again.',
  blocked: 'Something is already there. Pick an empty spot.',
  folder: 'Drag a folder into Alcove to link it without copying it.',
  linked: 'Linked folders stay in sync with the original folder.',
  parent: 'Press Esc to go to the parent folder.',
  peek: 'Peek shows what is inside without opening its app.',
  pickFirst: 'Click something first, then Peek.',
  launchFile: (name: string) => `${name} would open in its app now. This one is a demo. Ctrl+P peeks at it instead.`,
  launch: (name: string) => `${name} would open now. This one is a demo.`,
  theme: (name: string) => `${name}. The whole page changed with it.`,
  muted: 'Muted. Expand the group for the per-app mixer.',
  output: 'Your speakers and headphones list here, to switch between. This one is a demo.',
  mixer: 'Every app gets its own volume slider here. This one is a demo.',
  power: 'Power actions ask before they do anything.',
  search: 'Press Ctrl+F to jump to search',
};

const dir = (name: string, created: string, modified: string, entries: DemoEntry[]): DemoEntry => ({
  name,
  size: 0,
  created,
  modified,
  entries,
});
const file = (
  name: string,
  size: number,
  created: string,
  modified = created,
  extra: Pick<DemoEntry, 'body' | 'picture'> = {},
): DemoEntry => ({ name, size, created, modified, ...extra });

const projects: DemoEntry[] = [
  dir('Garden planner', '2026-03-02', '2026-09-14', [
    file('Beds and spacing.txt', 1840, '2026-03-02', '2026-04-11', {
      body: 'Bed 1 (sunny, by the fence)\n- tomatoes, 60 cm apart\n- basil in the gaps\n\nBed 2 (half shade)\n- lettuce, 25 cm apart\n- spinach\n\nBed 3\n- courgettes. Two plants. Not five. Remember last year.',
    }),
    file('Seed order.pdf', 96_400, '2026-03-09', '2026-03-09', {
      body: 'Order #58213\n\nTomato, San Marzano x 1\nBasil, Genovese x 2\nLettuce, Little Gem x 1\nCourgette, Black Beauty x 1\n\nTotal: 14.60',
    }),
    file('Watering schedule.xlsx', 12_300, '2026-04-20', '2026-09-14'),
  ]),
  dir('Photos to sort', '2026-06-18', '2026-10-02', [
    dir('Lisbon trip', '2026-06-18', '2026-06-25', [
      file('IMG_0412.jpg', 3_412_000, '2026-06-19', '2026-06-19', { picture: 'rooftops' }),
      file('IMG_0418.jpg', 2_987_000, '2026-06-19', '2026-06-19', { picture: 'river' }),
      file('IMG_0433.jpg', 3_105_000, '2026-06-21', '2026-06-21', { picture: 'tiles' }),
      file('IMG_0451.jpg', 2_764_000, '2026-06-24', '2026-06-24', { picture: 'hillside' }),
    ]),
    file('IMG_0587.jpg', 3_220_000, '2026-09-30', '2026-09-30', { picture: 'park' }),
    file('IMG_0592.jpg', 2_851_000, '2026-10-02', '2026-10-02', { picture: 'lake' }),
  ]),
  dir('Tax 2025', '2026-01-08', '2026-04-02', [
    file('Receipts.pdf', 1_204_000, '2026-01-08', '2026-03-28', {
      body: 'Receipts 2025\n\nLaptop (work)\nDesk chair\nTrain tickets, March\nTrain tickets, September\nThat one conference',
    }),
    file('Return.pdf', 412_000, '2026-04-02', '2026-04-02', {
      body: 'Tax return 2025\n\nStatus: submitted\nSubmitted on: 2 April 2026\n\nNothing else to do until next year.',
    }),
  ]),
  dir('Website', '2026-07-05', '2026-10-28', [
    dir('public', '2026-07-05', '2026-10-20', [
      file('glyph.svg', 975, '2026-07-05', '2026-07-05', { picture: 'glyph' }),
      file('og.png', 112_595, '2026-07-12', '2026-10-20', { picture: 'og' }),
    ]),
    dir('src', '2026-07-05', '2026-10-28', [
      file('AlcoveDemo.tsx', 17_605, '2026-07-20', '2026-10-28', {
        body: "export default function AlcoveDemo() {\n  // A working copy of Alcove, on the Alcove website.\n  // If you opened Projects, then Website, then src,\n  // then this file: you are inside it right now.\n  // Hello.\n  return <Alcove />;\n}",
      }),
      file('index.astro', 3_467, '2026-07-05', '2026-10-28'),
    ]),
    file('notes.txt', 920, '2026-07-06', '2026-10-28', {
      body: 'Website notes\n\n- make the demo actually work. Done.\n- put the website inside the demo. Done, and you found it.\n- stop adding easter eggs\n- the green is #58E5BB',
    }),
    file('package.json', 1_166, '2026-07-05', '2026-10-28', {
      body: '{\n  "name": "alcove-web",\n  "private": true,\n  "scripts": {\n    "dev": "astro dev",\n    "build": "astro build"\n  }\n}',
    }),
  ]),
  file('Budget.xlsx', 14_200, '2026-01-03', '2026-10-01'),
  file('Ideas.txt', 1_130, '2026-02-14', '2026-10-24', {
    body: 'Ideas\n\n- a shelf for the hallway\n- learn to make proper bread\n- sort the photos (see: Photos to sort)\n- a website for Alcove. Done, sort of. It is in Website.',
  }),
  file('Invoice 0042.pdf', 88_000, '2026-09-29', '2026-09-29', {
    body: 'Invoice 0042\n\nLogo and website for a small garden\n\nDesign: 6 hours\nBuild: 4 hours\n\nDue within 30 days. Thank you.',
  }),
  file('Packing list.txt', 640, '2026-06-10', '2026-06-17', {
    body: 'Lisbon\n\n- passport\n- adapter\n- comfortable shoes (it is all hills)\n- sunscreen\n- one book, not three',
  }),
];

export const demoHome: DemoItem[] = [
  { id: 'this-pc', kind: 'app', label: 'This PC', icon: 'this-pc', type: 'System folder', target: 'This PC', cell: [0, 0], compact: [0, 0], recent: 'Home - Aug 9, 2026' },
  {
    id: 'tools',
    kind: 'folder',
    label: 'Tools',
    color: '#22c55e',
    cell: [2, 0],
    compact: [2, 0],
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
    cell: [3, 0],
    compact: [3, 0],
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
      { id: 'vscode', kind: 'app', label: 'Visual Studio Code', icon: 'vscode', type: 'Shortcut', target: 'Code.exe', cell: [2, 0], recent: 'Dev - 2m ago' },
      { id: 'claude', kind: 'app', label: 'Claude', icon: 'claude', type: 'Shortcut', target: 'claude.exe', cell: [3, 0], recent: 'Dev - 15m ago' },
    ],
  },
  {
    id: 'games',
    kind: 'folder',
    label: 'Games',
    color: '#3b82f6',
    cell: [4, 0],
    compact: [2, 2],
    recent: 'Home - Oct 26, 2026',
    items: [
      { id: 'elden-ring', kind: 'app', label: 'Elden Ring', icon: 'elden-ring', type: 'Shortcut', target: 'eldenring.exe', cell: [0, 0], recent: 'Games - Oct 26, 2026' },
      { id: 'cyberpunk-2077', kind: 'app', label: 'Cyberpunk 2077', icon: 'cyberpunk-2077', type: 'Shortcut', target: 'Cyberpunk2077.exe', cell: [1, 0], recent: 'Games - Oct 19, 2026' },
      { id: 'forza-horizon-6', kind: 'app', label: 'Forza Horizon 6', icon: 'forza-horizon-6', type: 'Shortcut', target: 'ForzaHorizon6.exe', cell: [2, 0], recent: 'Games - Oct 24, 2026' },
      { id: 'last-of-us-2', kind: 'app', label: 'The Last of Us Part II', icon: 'last-of-us-2', type: 'Shortcut', target: 'tlou-ii.exe', cell: [3, 0], recent: 'Games - Sep 30, 2026' },
      { id: 'dead-space', kind: 'app', label: 'Dead Space', icon: 'dead-space', type: 'Internet shortcut', target: 'steam://rungameid/1693980', cell: [0, 1], recent: 'Games - Oct 12, 2026' },
      { id: 'death-stranding', kind: 'app', label: 'Death Stranding', icon: 'death-stranding', type: 'Internet shortcut', target: 'steam://rungameid/1850570', cell: [1, 1], recent: 'Games - Aug 30, 2026' },
      { id: 'marvel-rivals', kind: 'app', label: 'Marvel Rivals', icon: 'marvel-rivals', type: 'Internet shortcut', target: 'steam://rungameid/2767030', cell: [2, 1], recent: 'Games - Oct 25, 2026' },
      {
        id: 'co-op',
        kind: 'folder',
        label: 'Co-op',
        color: '#eab308',
        cell: [3, 1],
        recent: 'Games - Oct 22, 2026',
        items: [
        { id: 'portal-2', kind: 'app', label: 'Portal 2', icon: 'portal-2', type: 'Internet shortcut', target: 'steam://rungameid/620', cell: [0, 0], recent: 'Co-op - Oct 22, 2026' },
        { id: 'stardew-valley', kind: 'app', label: 'Stardew Valley', icon: 'stardew-valley', type: 'Internet shortcut', target: 'steam://rungameid/413150', cell: [1, 0], recent: 'Co-op - Oct 15, 2026' },
        { id: 'terraria', kind: 'app', label: 'Terraria', icon: 'terraria', type: 'Internet shortcut', target: 'steam://rungameid/105600', cell: [2, 0], recent: 'Co-op - Sep 21, 2026' },
        { id: 'satisfactory', kind: 'app', label: 'Satisfactory', icon: 'satisfactory', type: 'Shortcut', target: 'FactoryGame.exe', cell: [3, 0], recent: 'Co-op - Oct 5, 2026' },
        ],
      },
    ],
  },
  { id: 'chrome', kind: 'app', label: 'Google Chrome', icon: 'chrome', type: 'Shortcut', target: 'chrome.exe', cell: [0, 1], compact: [0, 1], recent: 'Home - 5m ago' },
  {
    id: 'media',
    kind: 'folder',
    label: 'Media',
    color: '#f97316',
    cell: [3, 1],
    compact: [3, 1],
    recent: 'Home - Aug 8, 2026',
    items: [
      { id: 'spotify', kind: 'app', label: 'Spotify', icon: 'spotify', type: 'Store App', target: 'Spotify', cell: [0, 0], recent: 'Media - Aug 8, 2026' },
      { id: 'vlc', kind: 'app', label: 'VLC media player', icon: 'vlc', type: 'Shortcut', target: 'vlc.exe', cell: [1, 0], recent: 'Media - Jul 21, 2026' },
      { id: 'photos', kind: 'app', label: 'Photos', icon: 'photos', type: 'Store App', target: 'Photos', cell: [2, 0], recent: 'Media - Jul 3, 2026' },
    ],
  },
  {
    id: 'projects',
    kind: 'folder',
    label: 'Projects',
    cell: [2, 1],
    compact: [2, 1],
    recent: 'Home - Oct 24, 2026',
    items: [],
    link: { path: 'C:\\Users\\You\\Projects', entries: projects },
  },
  { id: 'discord', kind: 'app', label: 'Discord', icon: 'discord', type: 'Shortcut', target: 'Update.exe', cell: [0, 4], compact: [0, 4], recent: 'Home - 1h ago' },
  { id: 'steam', kind: 'app', label: 'Steam', icon: 'steam', type: 'Shortcut', target: 'steam.exe', cell: [1, 4], compact: [1, 4], recent: 'Home - Aug 7, 2026' },
  {
    id: 'try',
    kind: 'file',
    label: 'Things to try.txt',
    icon: 'text-file',
    size: '412 B',
    path: 'C:\\Users\\You\\Desktop\\Things to try.txt',
    cell: [5, 2],
    compact: [1, 3],
    recent: 'Home - just now',
    body: 'Drag any tile to an empty spot. It stays there.\n\nClick Tools to open it.\n\nPress Ctrl+Space to hide this window, and again to bring it back.\n\nPress Ctrl+Shift+Space for the Shelf. Type "theme" in it.\n\nThe gear in the title bar switches themes too. The whole site changes with it.',
  },
  { id: 'explorer', kind: 'app', label: 'File Explorer', icon: 'file-explorer', type: 'Shortcut', target: 'explorer.exe', cell: [0, 2], compact: [0, 2], recent: 'Home - Aug 6, 2026' },
  {
    id: 'why',
    kind: 'file',
    label: 'Why Alcove.txt',
    icon: 'text-file',
    size: '605 B',
    path: 'C:\\Users\\You\\Desktop\\Why Alcove.txt',
    cell: [6, 2],
    compact: [2, 3],
    recent: 'Home - 10m ago',
    body: "Why Alcove?\n\nYou could keep minimising windows to find your desktop.\nYou could keep pinning things to a taskbar that's already full.\nYou could keep using the Start menu's \"recently added\" list\nto find the app you installed last week.\n\nOr you could just have a place for your stuff.",
  },
  { id: 'recycle-bin', kind: 'app', label: 'Recycle Bin', icon: 'recycle-bin', type: 'System folder', target: 'Recycle Bin', cell: [8, 4], compact: [3, 4], recent: 'Home - Aug 7, 2026' },
];
