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
  picture?: string;
}

export interface DemoEntry {
  name: string;
  size: number;
  created: string;
  modified: string;
  entries?: DemoEntry[];
  body?: string;
  picture?: string;
  hidden?: boolean;
  sealed?: boolean;
}

export interface DemoDrive {
  name: string;
  free: string;
  total: string;
  used: number;
}

export const demoDrives: DemoDrive[] = [
  { name: 'Local Disk (C:)', free: '512.6 GB', total: '931.5 GB', used: 45 },
  { name: 'Data (D:)', free: '1.31 TB', total: '1.82 TB', used: 28 },
];

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

export const demoNotchClipboard: { text: string; ago: string; image?: boolean }[] = [
  { text: 'npm run build', ago: 'just now' },
  { text: 'Image', ago: '1m ago', image: true },
  { text: 'Meeting notes for Thursday', ago: '3m ago' },
  { text: 'C:\\Users\\You\\Projects\\Website', ago: '5m ago' },
  { text: 'alcove-app.com', ago: '8m ago' },
];

export const demoDownloads: { name: string; icon: string; size: number; modified: string; picture?: string }[] = [
  { name: 'Holiday photo.jpg', icon: 'photos', size: 2_640_000, modified: '2026-10-30', picture: 'lake' },
  { name: 'Trailer.mp4', icon: 'vlc', size: 48_200_000, modified: '2026-10-29' },
  { name: 'Budget 2026.xlsx', icon: 'text-file', size: 18_400, modified: '2026-10-27' },
  { name: 'Invoice 0042.pdf', icon: 'text-file', size: 88_000, modified: '2026-10-21' },
  { name: 'Wallpaper.png', icon: 'photos', size: 4_120_000, modified: '2026-10-14', picture: 'hillside' },
  { name: 'Notes.txt', icon: 'notepad', size: 1_020, modified: '2026-10-09' },
];

/** A tile pinned to the Notch's apps side. */
export interface DemoPin {
  label: string;
  icon: string;
}

export const demoNotchPins: DemoPin[] = [
  { label: 'Spotify', icon: 'spotify' },
  { label: 'VS Code', icon: 'vscode' },
  { label: 'Terminal', icon: 'terminal' },
  { label: 'Discord', icon: 'discord' },
  { label: 'Steam', icon: 'steam' },
  { label: 'Chrome', icon: 'chrome' },
  { label: 'Notepad', icon: 'notepad' },
];

/** The pins the Notch's search box keeps, as the app's `filterView` does:
 *  a name containing the query, ignoring case. */
export function filterPins(pins: DemoPin[], query: string): DemoPin[] {
  const q = query.trim().toLowerCase();
  return q ? pins.filter((pin) => pin.label.toLowerCase().includes(q)) : pins;
}

export const demoNotchTracks: { title: string; artist: string; art: string }[] = [
  { title: 'Low Light', artist: 'Harbour Lines', art: 'rooftops' },
  { title: 'Second Window', artist: 'Mira Vale', art: 'lake' },
  { title: 'Quiet Hours', artist: 'The Overpass', art: 'hillside' },
];

export type DemoTaskId = 'drag' | 'folder' | 'nested' | 'peek' | 'files' | 'hide' | 'shelf' | 'notch' | 'theme';

export const demoTasks: { id: DemoTaskId; label: string }[] = [
  { id: 'theme', label: "Change the theme (the gear in the window's top-left corner)" },
  { id: 'drag', label: 'Drag a tile somewhere else' },
  { id: 'folder', label: 'Open a folder' },
  { id: 'nested', label: 'Find a folder inside a folder' },
  { id: 'peek', label: 'Peek inside a file' },
  { id: 'files', label: 'Open Alcove Files and find This PC (the folder button next to the power button)' },
  { id: 'hide', label: 'Hide Alcove with Ctrl+Space' },
  { id: 'shelf', label: 'Open the Shelf' },
  { id: 'notch', label: 'Open the Notch' },
];

export const demoHints = {
  start: 'Drag a tile somewhere else. It stays there.',
  moved: 'Moved. It stays there until you move it again.',
  blocked: 'Something is already there. Pick an empty spot.',
  arrangeOnly: 'Here tiles only move. The demo at the top of the page opens them.',
  folder: 'Drag a folder into Alcove to link it without copying it.',
  linked: 'Linked folders stay in sync with the original folder.',
  parent: 'Press Esc to go to the parent folder.',
  peek: 'Peek shows what is inside without opening its app.',
  pickFirst: 'Click something first, then Peek.',
  launchFile: (name: string) => `${name} would open in its app now. This is just a demo. Ctrl+P peeks at it instead.`,
  launch: (name: string) => `${name} would open now. This is just a demo.`,
  theme: (name: string) => `${name}. The whole page changed with it.`,
  muted: 'Muted. Expand the group for the per-app mixer.',
  output: 'Your speakers and headphones list here, to switch between. This is just a demo.',
  mixer: 'Every app gets its own volume slider here. This is just a demo.',
  power: 'Power actions ask before they do anything.',
  keepAwake: 'Keep awake is on. The PC will not sleep until you turn it off.',
  notch: 'The Notch. Rest your pointer on the top edge of the screen to open the Notch.',
  notchFiles: 'Alcove Files would open here, a folder browser that comes with Alcove. This is just a demo.',
  notchCopied: (text: string) => `Copied ${text} again. Your recent copies come from Windows clipboard history.`,
  notchPower: 'Power actions ask before they do anything. This is just a demo.',
  notchEdit: 'Edit layout lets you drag widgets around, resize them, and pick new ones.',
  notchSettings: 'Notch settings: the hairline, hover to expand, and which glances pop out.',
  notchAdd: 'Pin apps, files, or folders here, or drop one on the top edge of the screen.',
  notchAlcove: 'Alcove is open already. From any other app, this brings it to the front.',
  notchNoMatch: (query: string) => `Nothing pinned matches ${query}.`,
  notchTrack: (title: string) => `Playing ${title}. This is just a demo.`,
  gridView: 'Linked folders can show as a grid, with thumbnails of your photos.',
  search: 'Press Ctrl+F to jump to search',
  downloadDrag: (name: string) => `You can drop ${name} anywhere on your PC, or straight into another program.`,
  filesSealed: (name: string) => `${name} would open here. In the demo, only your own folders open.`,
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
  extra: Pick<DemoEntry, 'body' | 'picture' | 'hidden'> = {},
): DemoEntry => ({ name, size, created, modified, ...extra });
const sealed = (name: string, modified: string, hidden = false): DemoEntry => ({ name, size: 0, created: modified, modified, entries: [], sealed: true, hidden });
const desktopIni = (created: string) => file('desktop.ini', 282, created, created, { hidden: true });

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
    body: 'Drag any tile to an empty spot. It stays there.\n\nClick Tools to open it.\n\nPress Ctrl+Space to hide Alcove. Press it again to bring Alcove back.\n\nPress Ctrl+Shift+Space for the Shelf. Type "theme" in it.\n\nRest your pointer on the top edge of this desktop for the Notch.\n\nThe gear in the title bar switches themes too. The whole site changes with it.',
  },
  {
    id: 'lake',
    kind: 'file',
    label: 'Lake.jpg',
    icon: 'photos',
    picture: 'lake',
    size: '2.7 MB',
    path: 'C:\\Users\\You\\Desktop\\Lake.jpg',
    cell: [7, 2],
    compact: [3, 2],
    recent: 'Home - Oct 2, 2026',
    body: '',
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

const flatten = (list: DemoItem[], where: string): { item: DemoItem; where: string }[] =>
  list.flatMap((item) => [{ item, where }, ...(item.kind === 'folder' ? flatten(item.items, item.label) : [])]);

export const demoShelfItems = flatten(demoHome, 'Home');

const tile = (id: string) => flatten(demoHome, '').find((f) => f.item.id === id)?.item;
const tileFile = (id: string, size: number, created: string, modified = created): DemoEntry => {
  const t = tile(id);
  return t?.kind === 'file' ? file(t.label, size, created, modified, { body: t.body || undefined, picture: t.picture }) : file(id, size, created);
};
const shortcuts = (list: DemoItem[]): DemoEntry[] =>
  list.map((item) =>
    item.kind === 'folder' && !item.link
      ? dir(item.label, '2026-08-06', '2026-10-26', shortcuts(item.items))
      : file(`${item.label.replace(/\.[^.]+$/, '')}.lnk`,1_200 + item.label.length * 23, '2026-08-06', '2026-10-24'),
  );

export const demoPlaces: Record<string, DemoEntry[]> = {
  Desktop: [
    tileFile('try', 412, '2026-11-13'),
    tileFile('why', 605, '2026-08-06', '2026-11-13'),
    tileFile('lake', 2_700_000, '2026-10-02'),
    desktopIni('2026-08-06'),
  ],
  Documents: [
    dir('Letters', '2026-02-11', '2026-09-03', [
      file('Boiler, to the landlord.txt', 870, '2026-09-03', '2026-09-03', {
        body: 'Hi,\n\nThe boiler is making the noise again. The one that sounds like a small horse.\n\nAny chance someone could look at it this week?\n\nThanks',
      }),
      file('Council tax.pdf', 64_000, '2026-02-11'),
    ]),
    dir('Recipes', '2026-03-20', '2026-10-18', [
      file('Sourdough.txt', 1_420, '2026-03-20', '2026-10-18', {
        body: 'Sourdough, attempt 6\n\n500 g flour\n350 g water\n100 g starter\n10 g salt\n\nFold every 30 min, four times.\nOvernight in the fridge.\nAttempt 5 was a frisbee. Do not rush the proof.',
      }),
      file('Focaccia.txt', 760, '2026-05-02', '2026-05-02', {
        body: 'Focaccia\n\nSame dough, more oil.\nRosemary from the garden.\nDimple it like you mean it.',
      }),
    ]),
    tileFile('todo', 74, '2026-10-20', '2026-11-13'),
    file('CV 2026.pdf', 142_000, '2026-01-15', '2026-07-30'),
    file('Car insurance.pdf', 310_000, '2026-04-08'),
    desktopIni('2026-01-02'),
  ],
  Downloads: demoDownloads.map((d) => file(d.name, d.size, d.modified, d.modified, { picture: d.picture })),
  Pictures: [
    dir('Lisbon', '2026-06-26', '2026-06-26', [
      file('Rooftops.jpg', 3_412_000, '2026-06-19', '2026-06-19', { picture: 'rooftops' }),
      file('River.jpg', 2_987_000, '2026-06-19', '2026-06-19', { picture: 'river' }),
      file('Tiles.jpg', 3_105_000, '2026-06-21', '2026-06-21', { picture: 'tiles' }),
    ]),
    dir('Screenshots', '2026-07-12', '2026-10-20', [file('Screenshot 2026-10-20 214508.png', 112_595, '2026-10-20', '2026-10-20', { picture: 'og' })]),
    file('Allotment in June.jpg', 3_220_000, '2026-06-14', '2026-06-14', { picture: 'park' }),
    file('Hillside.jpg', 4_120_000, '2026-10-14', '2026-10-14', { picture: 'hillside' }),
    desktopIni('2026-01-02'),
  ],
  Music: [
    ...demoNotchTracks.map((t) => dir(t.artist, '2026-05-10', '2026-09-22', [file(`${t.title}.mp3`, 7_400_000 + t.title.length * 91_000, '2026-05-10', '2026-09-22', { picture: t.art })])),
    desktopIni('2026-01-02'),
  ],
  Videos: [
    dir('Lisbon', '2026-06-26', '2026-06-26', [file('Tram 28.mp4', 96_400_000, '2026-06-22'), file('Sunset at the river.mp4', 61_800_000, '2026-06-24')]),
    file('Garden timelapse.mp4', 212_000_000, '2026-09-14'),
    desktopIni('2026-01-02'),
  ],
  Projects: projects,
  'Local Disk (C:)': [
    sealed('$Recycle.Bin', '2026-11-12', true),
    sealed('Program Files', '2026-10-29'),
    sealed('Program Files (x86)', '2026-10-21'),
    sealed('Users', '2026-01-02'),
    sealed('Windows', '2026-11-06'),
    file('pagefile.sys', 8_589_934_592, '2026-11-13', '2026-11-13', { hidden: true }),
  ],
  Alcove: shortcuts(demoHome),
};
