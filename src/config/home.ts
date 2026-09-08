export interface FeatureTab {
  id: string;
  title: string;
  heading: string;
  description: string;
  screenshot: string;
  alt: string;
}

export interface NarrativeSection {
  id: string;
  heading: string;
  motifSide: 'left' | 'right';
  paragraphs: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQGroup {
  title: string;
  items: FAQItem[];
}

export const features: FeatureTab[] = [
  {
    id: 'workspace',
    title: 'Your space',
    heading: 'A grid you arrange the way you think',
    description:
      'Drop shortcuts, apps, folders, and shell objects onto a grid. Drag them around, snap them into place, and the layout stays the way you left it. It\'s a workspace you arrange, not a list somebody else designed.',
    screenshot: 'grid-view.png',
    alt: 'The Alcove workspace grid with shortcuts and folders arranged on it',
  },
  {
    id: 'folders',
    title: 'Folders & junctions',
    heading: 'Organise without copying anything',
    description:
      'Drag a folder in and it becomes a Windows junction, not a copy. The original stays put. You can group related items into in-app folders and colour them to find things at a glance.',
    screenshot: 'folders.png',
    alt: 'Alcove folders and junctions shown in the workspace',
  },
  {
    id: 'themes',
    title: 'Themes',
    heading: 'Make it look like yours',
    description:
      'Forty themes across light, dark, and retro. Adjustable tile size and window opacity. It\'s not the main thing, but it\'s there.',
    screenshot: 'themes.png',
    alt: 'Alcove theme picker showing a selection of light, dark, and retro themes',
  },
  {
    id: 'peek',
    title: 'Peek',
    heading: 'Preview without opening',
    description:
      'Peek a file to see what\'s inside without launching anything. Works on images, documents, text - anything where a quick look beats opening the whole app.',
    screenshot: 'peek.png',
    alt: 'Alcove Peek previewing a file inside the workspace',
  },
  {
    id: 'shelf',
    title: 'Shelf',
    heading: 'When typing is faster than browsing',
    description:
      'The Shelf sits alongside the workspace. Local search finds anything in your grid. Google and Wikipedia scopes open in your browser or preview inline. It\'s there for when typing is faster than browsing.',
    screenshot: 'shelf.png',
    alt: 'The Alcove Shelf with local search results',
  },
];

export const narrative: NarrativeSection[] = [
  {
    id: 'one-hotkey-away',
    heading: 'One hotkey away',
    motifSide: 'right',
    paragraphs: [
      'Hit your hotkey from anywhere in Windows and your space appears. Hit it again and it is gone. No alt-tabbing through twenty windows, no minimising everything to get to the desktop.',
      'Everything you put in Alcove stays where you left it. Drag it around, rearrange it until it fits.',
      'Drop a `.lnk`, `.url`, or `.exe` onto the window and Alcove copies it in, pulls out its icon, and drops it on the grid. Drag a folder in and it becomes a Windows junction, not a copy, so the original stays put. Click to launch. That is the whole idea.',
    ],
  },
  {
    id: 'not-a-launcher',
    heading: 'Not a launcher',
    motifSide: 'left',
    paragraphs: [
      'A launcher is a list you type at. Alcove is a space you arrange. The Shelf is in there too - local search, Google, Wikipedia - but the grid comes first.',
      'The grid is the thing: the stuff you use, laid out the way you think about it, visible all at once instead of buried in a menu.',
      'Around the edges: Peek for quick file previews, volume and audio device switching with a per-app mixer, power actions that ask before they act, and full keyboard navigation if you\'d rather not touch the mouse.',
    ],
  },
  {
    id: 'yours-privately',
    heading: 'Yours, privately',
    motifSide: 'right',
    paragraphs: [
      'Nothing leaves your machine unless you ask it to. No account, no telemetry, no analytics, no crash reporting. Your workspace lives in `%APPDATA%\\Alcove\\` as plain JSON and copied files.',
      'Back it up to a single `.alcove-backup` file and restore it whenever. The only network calls are the ones you trigger yourself - a Wikipedia lookup, a Google search opened in your browser, a currency conversion pulling the ECB rate feed.',
    ],
  },
];

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
          'Nothing leaves your machine unless you ask it to. There is no account, no telemetry, and no analytics. Your workspace lives in %APPDATA%\\Alcove\\ as plain JSON and copied files.',
      },
      {
        question: 'Why only Windows?',
        answer:
          'Alcove is built on Windows Shell APIs. The workspace, the junctions, the icon extraction, the hotkeys - all of it is Windows-specific. That is where it lives.',
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
        answer: 'Settings > About > "What\'s new", inside the app.',
      },
    ],
  },
];
