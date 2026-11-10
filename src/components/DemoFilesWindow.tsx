import '../styles/demo-files.css';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronUp,
  Copy,
  Download,
  EyeOff,
  File,
  FileText,
  Folder,
  FolderOpen,
  HardDrive,
  House,
  Image,
  Laptop,
  LayoutGrid,
  List,
  Minus,
  Monitor,
  Music,
  Search,
  Video,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { demoHome, demoIcon } from '../config/demo';
import type { DemoEntry } from '../config/demo';

const FOLDER_PATH = 'C:\\Users\\You\\Projects';
const SELECTED = 'Website';
const FREE_SPACE = '212.4 GB free';

const crumbs = ['This PC', 'Local Disk (C:)', 'Users', 'You', 'Projects'];

const sidebar: { label: string; icon: LucideIcon; group?: boolean; active?: boolean }[] = [
  { label: 'This PC', icon: Laptop },
  { label: 'Desktop', icon: Monitor, group: true },
  { label: 'Documents', icon: FileText },
  { label: 'Downloads', icon: Download },
  { label: 'Pictures', icon: Image },
  { label: 'Music', icon: Music },
  { label: 'Videos', icon: Video },
  { label: 'Projects', icon: Folder, group: true, active: true },
  { label: 'Local Disk (C:)', icon: HardDrive, group: true },
  { label: 'Alcove', icon: House, group: true },
];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'modified', label: 'Modified' },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size' },
] as const;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const isFolder = (e: DemoEntry) => Boolean(e.entries);

const extensionOf = (name: string) => {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
};

const typeLabel = (e: DemoEntry) => {
  if (isFolder(e)) return 'File folder';
  const ext = extensionOf(e.name);
  return ext ? `${ext.toUpperCase()} file` : 'File';
};

function formatModified(e: DemoEntry) {
  const [y, m, d] = e.modified.split('-').map(Number);
  const minutes = ((e.name.length * 37 + e.size) % 600) + 480;
  const hour = Math.floor(minutes / 60);
  const mm = String(minutes % 60).padStart(2, '0');
  return `${MONTHS[m - 1]} ${d}, ${y}, ${hour > 12 ? hour - 12 : hour}:${mm} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const linked = demoHome.find((i) => i.kind === 'folder' && i.link?.path === FOLDER_PATH);
const entries = [...(linked?.kind === 'folder' ? (linked.link?.entries ?? []) : [])].sort(
  (a, b) =>
    Number(isFolder(b)) - Number(isFolder(a)) ||
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }),
);

function EntryIcon({ entry }: { entry: DemoEntry }) {
  if (isFolder(entry)) return <Folder size={16} strokeWidth={1.5} />;
  const icon = extensionOf(entry.name) === 'txt' ? demoIcon('text-file') : undefined;
  if (icon) return <img src={icon} alt="" width={16} height={16} draggable={false} />;
  return <File size={16} strokeWidth={1.5} />;
}

export default function DemoFilesWindow({ themeClass, frosted = false }: { themeClass: string; frosted?: boolean }) {
  return (
    <div className={`alc-app ${themeClass} alc-files`} data-frosted={frosted || undefined}>
      <div className="alc-files-titlebar">
        <FolderOpen size={14} />
        <span className="alc-files-title alc-files-text alc-files-trunc">Alcove Files</span>
        <div className="alc-files-grab">
          <span />
        </div>
        <span className="alc-files-cap">
          <Minus size={14} />
        </span>
        <span className="alc-files-cap">
          <Copy size={12} style={{ transform: 'scaleX(-1)' }} />
        </span>
        <span className="alc-files-cap">
          <X size={14} />
        </span>
      </div>

      <div className="alc-files-toolbar">
        <span className="alc-files-btn">
          <ArrowLeft size={14} />
        </span>
        <span className="alc-files-btn" data-disabled>
          <ArrowRight size={14} />
        </span>
        <span className="alc-files-btn">
          <ArrowUp size={14} />
        </span>
        <div className="alc-files-address">
          <div className="alc-files-crumbs">
            {crumbs.map((label, i) => (
              <span key={label} style={{ display: 'contents' }}>
                {i > 0 && <span className="alc-files-sep">/</span>}
                <span className="alc-files-crumb alc-files-trunc" data-current={i === crumbs.length - 1 || undefined}>
                  {label}
                </span>
              </span>
            ))}
          </div>
        </div>
        <span className="alc-files-btn" data-active>
          <List size={14} />
        </span>
        <span className="alc-files-btn">
          <LayoutGrid size={14} />
        </span>
        <span className="alc-files-btn">
          <EyeOff size={14} />
        </span>
        <div className="alc-files-filter">
          <Search size={12} />
          <span className="alc-files-filter-box">Filter...</span>
          <kbd>Ctrl+F</kbd>
        </div>
      </div>

      <div className="alc-files-body">
        <nav className="alc-files-sidebar" aria-label="Places">
          {sidebar.map(({ label, icon: Icon, group, active }, i) => (
            <div key={label}>
              {group && i > 0 && <div className="alc-files-divider" />}
              <div className="alc-files-place" data-active={active || undefined}>
                <Icon size={14} />
                <span className="alc-files-trunc">{label}</span>
              </div>
            </div>
          ))}
        </nav>

        <div className="alc-files-pane">
          <div className="alc-files-head">
            <div style={{ width: 16, flexShrink: 0 }} />
            {columns.map((col) => (
              <div key={col.key} className="alc-files-col" data-w={col.key}>
                {col.label}
                {col.key === 'name' && <ChevronUp size={12} />}
              </div>
            ))}
          </div>
          <div className="alc-files-list" role="listbox" aria-label="Items">
            {entries.map((entry) => {
              const selected = entry.name === SELECTED;
              return (
                <div key={entry.name} className="alc-files-row" role="option" aria-selected={selected} data-selected={selected || undefined}>
                  <span className="alc-files-icon">
                    <EntryIcon entry={entry} />
                  </span>
                  <span className="alc-files-name alc-files-trunc">{entry.name}</span>
                  <span className="alc-files-cell alc-files-trunc" data-w="modified">
                    {formatModified(entry)}
                  </span>
                  <span className="alc-files-cell alc-files-trunc" data-w="type">
                    {typeLabel(entry)}
                  </span>
                  <span className="alc-files-cell" data-w="size">
                    {isFolder(entry) ? '' : formatSize(entry.size)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="alc-files-status">
        <span>{entries.length} items</span>
        <span>1 selected</span>
        <span className="alc-files-grow" />
        <span>{FREE_SPACE}</span>
      </div>
    </div>
  );
}
