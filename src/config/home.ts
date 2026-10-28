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
    caption: 'Look inside an image, document, or text file right from the grid, without opening its app.',
    screenshot: 'peek.png',
    alt: 'Alcove Peek previewing a file inside the workspace',
  },
  {
    id: 'shelf',
    title: 'Shelf',
    caption:
      'Its own hotkey opens it from anywhere. It finds apps, files, and folders on your PC as you type, and searches Google or Wikipedia when you want the web.',
    screenshot: 'shelf.png',
    alt: 'The Alcove Shelf with local search results',
  },
];

export const demo: DemoCopy = {
  heading: 'One hotkey away',
  lede: 'Hit your hotkey from anywhere in Windows and your space appears. Hit it again and it is gone.',
};

export const comparison: Comparison = {
  columns: ['Windows desktop', 'Start menu pins', 'Alcove'],
  rows: [
    {
      task: 'Reach it over open windows',
      cells: ['Win + D minimises everything first', 'Win key, over anything', 'Your hotkey, and again to hide it'],
    },
    {
      task: 'Arrange things your way',
      cells: ['Anywhere, until something covers it', 'A fixed grid you can reorder', 'A grid you drag into shape'],
    },
    {
      task: 'Group related things',
      cells: ['Folders, which move the files', 'Folders, one level deep', 'Coloured folders, and real folders linked, not copied'],
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
      cells: ['Copy the files by hand', 'Windows Backup, with a Microsoft account', 'One .alcove-backup file, no account'],
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
          'A visual workspace for Windows. You arrange shortcuts, folders, apps, and tools on a grid, then bring it up with a hotkey from anywhere.',
      },
      {
        question: 'Is it free?',
        answer:
          'Yes. It\'s a personal project and it\'s free for personal or internal business use. See the Terms of Use for the details. If you\'d like to support development, there\'s a <a href="https://ko-fi.com/iamincontrol" target="_blank" rel="noopener noreferrer">Ko-fi page</a> - entirely optional.',
      },
      {
        question: 'What happens to my data?',
        answer:
          'Your workspace stays on your machine. There is no account, no telemetry, and no analytics. It lives in %APPDATA%\\Alcove\\ as plain JSON and copied files. The few times Alcove goes online are listed in the <a href="privacy/">Privacy Policy</a>.',
      },
      {
        question: 'Does it work with a controller?',
        answer:
          'Yes. An Xbox controller, or anything Windows sees as one, gets you around the grid, the Shelf, Peek, and Settings. A layout guide shows the buttons when you connect it, and you can remap them in Settings > Behavior > Controller. PlayStation controllers work through Steam Input or DS4Windows.',
      },
      {
        question: 'Why only Windows?',
        answer:
          'Alcove is built on Windows Shell APIs. The workspace, the linked folders, the icon extraction, the hotkeys - all of it is Windows-specific. That is where it lives.',
      },
      {
        question: 'How do I get it?',
        answer:
          'Click "Download for Windows" on the home page to get the latest installer - you\'ll be taken to a short install guide while the file downloads. Current builds are not code-signed, so Windows SmartScreen may warn you; choose "More info" and "Run anyway" if you trust the download. Step-by-step instructions are on the <a href="install/">Install</a> page.',
      },
      {
        question: 'Can I back up my workspace?',
        answer:
          'Yes. Settings > Backup & restore exports your whole workspace to a single .alcove-backup file. Importing replaces your current workspace, so only import archives you trust.',
      },
    ],
  },
  {
    title: 'Troubleshooting',
    items: [
      {
        question: 'Where does Alcove store my data?',
        answer:
          'Everything is under %APPDATA%\\Alcove\\. Paste that into File Explorer to open it, or use the link in Settings > About.',
      },
      {
        question: 'How do I back up and restore?',
        answer:
          'Settings > Backup & restore. Export to a .alcove-backup file wherever you choose. Importing replaces your current workspace and asks you to confirm first.',
      },
      {
        question: 'Why does Windows SmartScreen warn me?',
        answer:
          'Current builds are not code-signed. SmartScreen warns about unsigned installers generally. It is a signing gap, not a sign that anything is wrong with the file.',
      },
      {
        question: 'Where is the changelog?',
        answer:
          'On the <a href="changelog/">Changelog</a> page, or inside the app under Settings > About > "What\'s new".',
      },
    ],
  },
];
