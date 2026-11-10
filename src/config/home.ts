import { demoNotchPins, type DemoPin } from './demo';

export interface TourShot {
  id: string;
  title: string;
  caption: string;
  screenshot: string;
  alt: string;
}

export interface DemoCopy {
  heading: string;
  lede: string;
}

export interface ComparisonRow {
  task: string;
  cells: string[];
}

export interface Comparison {
  columns: string[];
  rows: ComparisonRow[];
}

export interface HeroSlide {
  screenshot: string;
  alt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQGroup {
  title: string;
  items: FAQItem[];
}

export const heroSlides: HeroSlide[] = [
  {
    screenshot: 'hero-1.webp',
    alt: 'Alcove in its default dark theme, open over a night-sky desktop',
  },
  {
    screenshot: 'hero-2.webp',
    alt: 'Alcove in a translucent theme over a purple Windows 11 wallpaper',
  },
  {
    screenshot: 'hero-3.webp',
    alt: 'Alcove in a light theme over the Windows 11 Bloom wallpaper',
  },
  {
    screenshot: 'hero-4.webp',
    alt: 'Alcove in a retro theme over the Windows 10 wallpaper',
  },
  {
    screenshot: 'hero-5.webp',
    alt: 'Alcove in a translucent theme over an illustrated swamp with two frogs on a raft',
  },
  {
    screenshot: 'hero-6.webp',
    alt: 'Alcove in a dark teal theme over a koi pond wallpaper',
  },
  {
    screenshot: 'hero-7.webp',
    alt: 'Alcove in a soft pink theme over a photo of blossom on a branch',
  },
  {
    screenshot: 'hero-8.webp',
    alt: 'Alcove in a grey theme over a night photo of a street light in fog',
  },
  {
    screenshot: 'hero-9.webp',
    alt: 'Alcove in a deep red theme over an illustrated red tree at sunset',
  },
];

export const tour: TourShot[] = [
  {
    id: 'workspace',
    title: 'Your space',
    caption:
      'Shortcuts, apps, folders, and shell objects on a grid you drag into shape. It stays the way you left it.',
    screenshot: 'grid-view.png',
    alt: 'The Alcove workspace grid with shortcuts and folders arranged on it',
  },
  {
    id: 'folders',
    title: 'Folders',
    caption: 'Group things into coloured folders. Drag in a real folder and it is linked, not copied.',
    screenshot: 'folders.png',
    alt: 'Alcove folders shown in the workspace',
  },
  {
    id: 'themes',
    title: 'Themes',
    caption: 'Forty of them across light, dark, and retro, with adjustable tile size and window opacity.',
    screenshot: 'themes.png',
    alt: 'Alcove theme picker showing a selection of light, dark, and retro themes',
  },
  {
    id: 'peek',
    title: 'Peek',
    caption: 'Look inside a photo, document, code file, zip, or song right from the grid, without opening its app.',
    screenshot: 'peek.png',
    alt: 'Alcove Peek previewing a file inside the workspace',
  },
  {
    id: 'files',
    title: 'Alcove Files',
    caption:
      'Browse any folder on your PC in its own window, with Peek built in. Anything you add from it is linked, not copied.',
    screenshot: 'files.png',
    alt: 'Alcove Files browsing a folder with the sidebar and file list',
  },
  {
    id: 'shelf',
    title: 'Shelf',
    caption:
      'The Shelf has its own hotkey and opens from anywhere. The Shelf finds apps, files, and folders on your PC as you type, and searches Google or Wikipedia when you want the web.',
    screenshot: 'shelf.png',
    alt: 'The Alcove Shelf with local search results',
  },
  {
    id: 'notch',
    title: 'Notch',
    caption: 'Rest your pointer at the top of your screen for your pinned apps and a board of widgets.',
    screenshot: 'notch.png',
    alt: 'The Alcove Notch open at the top of the screen with pinned apps and widgets',
  },
];

export const demo: DemoCopy = {
  heading: 'One hotkey away',
  lede: 'Hit your hotkey from anywhere in Windows and your space appears. Hit it again and Alcove is gone.',
};

export const comparison: Comparison = {
  columns: ['Windows desktop', 'Start menu pins', 'Alcove'],
  rows: [
    {
      task: 'Reach it over open windows',
      cells: ['Win + D minimises everything first', 'Win key, over anything', 'One hotkey, over anything'],
    },
    {
      task: 'Keep a few things one move away',
      cells: ['Behind whatever is open', 'Win key, then find the pin', 'The Notch, at the top edge of your screen'],
    },
    {
      task: 'Put things where you want them',
      cells: ['Anywhere, until something covers it', 'A fixed grid you can reorder', 'A grid you drag into shape'],
    },
    {
      task: 'Group related things',
      cells: ['Folders, which move the files', 'Folders, one level deep', 'Coloured folders, or link a real one'],
    },
    {
      task: 'Find something by typing',
      cells: ['Not really', 'Start search, mixed in with web results', 'The Shelf: apps, files, and folders as you type'],
    },
    {
      task: 'Look inside a file',
      cells: ['Open it', 'Open it', 'Peek, without opening the app'],
    },
    {
      task: 'Back up the layout',
      cells: ['Copy the files by hand', 'Windows Backup, with a Microsoft account', 'One file, no account'],
    },
  ],
};

export const faqGroups: FAQGroup[] = [
  {
    title: 'About Alcove',
    items: [
      {
        question: 'What is Alcove?',
        answer:
          'A visual workspace for Windows. You arrange shortcuts, folders, apps, and tools on a grid, then bring Alcove up with a hotkey from anywhere.',
      },
      {
        question: 'Is Alcove free?',
        answer:
          'Yes. Alcove is a personal project, free for personal or internal business use. See the Terms of Use for the details. If you\'d like to support development, there\'s a <a href="https://ko-fi.com/iamincontrol" target="_blank" rel="noopener noreferrer">Ko-fi page</a> - entirely optional.',
      },
      {
        question: 'What happens to my data?',
        answer:
          'Your workspace stays on your machine. There is no account, no telemetry, and no analytics. It lives in %APPDATA%\\Alcove\\ as plain JSON and copied files. Paste that into File Explorer to open it, or use Data folder in Settings > Data management. The few times Alcove goes online are listed in the <a href="privacy/">Privacy Policy</a>.',
      },
      {
        question: 'Does Alcove work with a controller?',
        answer:
          'Yes. An Xbox controller, or anything Windows sees as one, gets you around the grid, the Shelf, the Notch, Peek, and Settings. A layout guide shows the buttons when you connect it, and you can remap them in Settings > Controller. PlayStation controllers work through Steam Input or DS4Windows.',
      },
      {
        question: 'Do I have to add everything by hand?',
        answer:
          'No. Drag things in, or use Import from Desktop once. After that, new things on your Desktop show up in your Home folder by themselves. You can turn that off in Settings.',
      },
      {
        question: 'Can I turn the Notch off?',
        answer:
          'Yes, in Settings > Notch. The same section sets a hotkey for the Notch, picks the monitor, and can draw a thin hairline so you can see where the Notch sits. The Notch never opens while you drag a window or while a game or video is fullscreen.',
      },
      {
        question: 'Why only Windows?',
        answer:
          'Alcove is built on Windows Shell APIs. The workspace, the linked folders, the icon extraction, the hotkeys - all of it is Windows-specific. That is where Alcove lives.',
      },
      {
        question: 'How do I get Alcove?',
        answer:
          'Click "Download for Windows" on the home page to get the latest installer - you\'ll be taken to a short install guide while the file downloads. Current builds are not code-signed, so Windows SmartScreen may warn you; choose "More info" and "Run anyway" if you trust the download. Step-by-step instructions are on the <a href="install/">Install</a> page.',
      },
      {
        question: 'Can I back up my workspace?',
        answer:
          'Yes. Export backup, under Settings > Data management, saves your whole workspace, Notch included, to a single .alcove-backup file wherever you choose. Import backup replaces your current workspace and asks you to confirm first, so only import archives you trust.',
      },
    ],
  },
  {
    title: 'Troubleshooting',
    items: [
      {
        question: 'Why does Windows SmartScreen warn me?',
        answer:
          'Current builds are not code-signed. SmartScreen warns about unsigned installers generally. It is a signing gap, not a sign that anything is wrong with the file.',
      },
      {
        question: 'Where is the changelog?',
        answer:
          'On the <a href="changelog/">Changelog</a> page, or inside the app under Settings > Help & Info > Changelog.',
      },
    ],
  },
];

export type ShelfSymbol = 'sheet' | 'file' | 'folder' | 'coffee' | 'volume' | 'monitor' | 'sigma';

export interface ShelfSnippetRow {
  icon: { app: string } | { symbol: ShelfSymbol };
  name: string;
  detail: string;
}

export interface ShelfSnippet {
  query: string;
  filesOnly?: boolean;
  sections: { label: string; rows: ShelfSnippetRow[] }[];
}

export interface NotchPopout {
  icon: 'timer' | 'batteryLow';
  title: string;
  detail: string;
  tone: 'accent' | 'danger';
}

export type CardVisual =
  | { kind: 'shelf'; snippet: ShelfSnippet }
  | { kind: 'glance' }
  | { kind: 'popout'; popout: NotchPopout }
  | { kind: 'notchSearch'; query: string; pins: DemoPin[] };

export interface FeatureCard {
  title: string;
  caption: string;
  visual: CardVisual;
}

export const shelfCards: FeatureCard[] = [
  {
    title: 'Files, not just apps',
    caption:
      'The Shelf searches the files in your user folders and on any drive you add in Settings, as you type. Tick Files only to filter by type, place, or date.',
    visual: {
      kind: 'shelf',
      snippet: {
        query: 'budget',
        filesOnly: true,
        sections: [
          {
            label: 'Files',
            rows: [
              { icon: { symbol: 'sheet' }, name: 'Budget 2026.xlsx', detail: 'Documents\\Finance' },
              { icon: { symbol: 'file' }, name: 'budget-notes.txt', detail: 'Desktop' },
              { icon: { symbol: 'folder' }, name: 'Budget', detail: 'D:\\Work' },
            ],
          },
        ],
      },
    },
  },
  {
    title: 'Commands',
    caption: 'Lock, Restart, Empty Recycle Bin, Keep awake, and more, from the same search box.',
    visual: {
      kind: 'shelf',
      snippet: {
        query: 'toggle',
        sections: [
          {
            label: 'Commands',
            rows: [
              { icon: { symbol: 'coffee' }, name: 'Toggle keep awake', detail: 'Power' },
              { icon: { symbol: 'volume' }, name: 'Toggle mute', detail: 'Audio' },
              { icon: { symbol: 'monitor' }, name: 'Toggle desktop icons', detail: 'Desktop' },
            ],
          },
        ],
      },
    },
  },
  {
    title: 'Quick answers',
    caption:
      'Maths, unit conversions, and currency as you type, with the answer ready to copy. Switch to Google or Wikipedia when you do want the web, and Wikipedia articles open right in the preview.',
    visual: {
      kind: 'shelf',
      snippet: {
        query: '20 dollars in rands',
        sections: [
          { label: 'Answer', rows: [{ icon: { symbol: 'sigma' }, name: '328.96 ZAR', detail: 'ECB reference rate - 2026-11-09' }] },
        ],
      },
    },
  },
];

export const notchCards: FeatureCard[] = [
  {
    title: 'A glance',
    caption: "Rest your pointer on the top edge and the Notch shows what's playing and the time. Move away and the Notch tucks back in.",
    visual: { kind: 'glance' },
  },
  {
    title: 'Pops out when it matters',
    caption: 'If you want, the Notch pops out for a few seconds when a song changes, a timer ends, or your battery runs low.',
    visual: { kind: 'popout', popout: { icon: 'timer', title: 'Timer done', detail: '25 min timer', tone: 'accent' } },
  },
  {
    title: 'Find a pin fast',
    caption: 'Type in the search bar along the bottom of the Notch to narrow your pinned apps, and press Enter to open the first. The buttons beside it open Alcove and the Shelf.',
    visual: { kind: 'notchSearch', query: 'co', pins: demoNotchPins },
  },
];
