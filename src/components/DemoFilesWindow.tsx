import '../styles/demo-files.css';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Eye,
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { demoDrives, demoHints, demoIcon, demoPicture, demoPlaces } from '../config/demo';
import type { DemoEntry } from '../config/demo';

const FREE_SPACE = `${demoDrives[0].free} free`;
const STATUS_MS = 4000;

const sidebar = [
  { label: 'This PC', icon: Laptop },
  { label: 'Desktop', icon: Monitor, group: true },
  { label: 'Documents', icon: FileText },
  { label: 'Downloads', icon: Download },
  { label: 'Pictures', icon: Image },
  { label: 'Music', icon: Music },
  { label: 'Videos', icon: Video },
  { label: 'Projects', icon: Folder, group: true },
  { label: 'Local Disk (C:)', icon: HardDrive, group: true },
  { label: 'Alcove', icon: House, group: true },
] as const satisfies readonly { label: string; icon: LucideIcon; group?: boolean }[];

export type FilesPlace = (typeof sidebar)[number]['label'];

interface Location {
  place: FilesPlace;
  path: string[];
}

function baseCrumbs(place: FilesPlace): { label: string; to?: Location }[] {
  if (place === 'This PC' || place === 'Alcove') return [{ label: place }];
  const pc = { label: 'This PC', to: { place: 'This PC' as const, path: [] } };
  const disk = { label: 'Local Disk (C:)', to: { place: 'Local Disk (C:)' as const, path: [] } };
  if (place === 'Local Disk (C:)') return [pc, { label: place }];
  return [pc, disk, { label: 'Users' }, { label: 'You' }, { label: place, to: { place, path: [] } }];
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'modified', label: 'Modified' },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size' },
] as const;

type SortKey = (typeof columns)[number]['key'];

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
  if (bytes < 1024 ** 3) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

const drives: DemoEntry[] = demoDrives.map((d) => ({ name: d.name, size: 0, created: '', modified: '', sealed: true }));

function listAt({ place, path }: Location): DemoEntry[] {
  const root = place === 'This PC' ? drives : (demoPlaces[place] ?? []);
  return path.reduce<DemoEntry[]>((list, name) => list.find((e) => e.name === name)?.entries ?? [], root);
}

function sortEntries(list: DemoEntry[], key: SortKey, dir: 'asc' | 'desc') {
  const sign = dir === 'asc' ? 1 : -1;
  const by = (a: DemoEntry, b: DemoEntry) => {
    if (key === 'modified') return a.modified.localeCompare(b.modified);
    if (key === 'size') return a.size - b.size;
    if (key === 'type') return typeLabel(a).localeCompare(typeLabel(b));
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  };
  return [...list].sort((a, b) => Number(isFolder(b)) - Number(isFolder(a)) || sign * by(a, b));
}

const sameLocation = (a: Location, b: Location) => a.place === b.place && a.path.join('/') === b.path.join('/');

function EntryIcon({ entry, size = 16, thumb = false }: { entry: DemoEntry; size?: number; thumb?: boolean }) {
  if (isFolder(entry)) return <Folder size={size} strokeWidth={1.5} />;
  const picture = thumb && entry.picture ? demoPicture(entry.picture) : undefined;
  if (picture) return <img className="alc-files-thumb" src={picture} alt="" width={size} height={size} draggable={false} />;
  const icon = extensionOf(entry.name) === 'txt' ? demoIcon('text-file') : undefined;
  if (icon) return <img src={icon} alt="" width={size} height={size} draggable={false} />;
  return <File size={size} strokeWidth={1.5} />;
}


interface Props {
  themeClass: string;
  frosted?: boolean;
  place?: FilesPlace;
  onClose?: () => void;
  onPlace?: (place: FilesPlace) => void;
}

export default function DemoFilesWindow({ themeClass, frosted = false, place = 'Projects', onClose, onPlace }: Props) {
  const [history, setHistory] = useState<{ stack: Location[]; at: number }>({ stack: [{ place, path: [] }], at: 0 });
  const [selected, setSelected] = useState<string | null>(place === 'Projects' ? 'Website' : null);
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [showHidden, setShowHidden] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const filterRef = useRef<HTMLInputElement>(null);

  const here = history.stack[history.at];
  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = here.place === 'This PC' ? listAt(here) : sortEntries(listAt(here), sort.key, sort.dir);
    return list.filter((e) => (showHidden || !e.hidden) && e.name.toLowerCase().includes(q));
  }, [here, sort, query, showHidden]);
  const atPc = here.place === 'This PC';

  useEffect(() => {
    onPlace?.(here.place);
  }, [here.place]);

  useEffect(() => {
    if (!status) return;
    const id = window.setTimeout(() => setStatus(null), STATUS_MS);
    return () => window.clearTimeout(id);
  }, [status]);

  const go = (to: Location) => {
    if (sameLocation(to, here)) return;
    setHistory((h) => ({ stack: [...h.stack.slice(0, h.at + 1), to], at: h.at + 1 }));
    setSelected(null);
    setQuery('');
    setStatus(null);
  };

  const step = (by: -1 | 1) => {
    setHistory((h) => ({ ...h, at: Math.min(h.stack.length - 1, Math.max(0, h.at + by)) }));
    setSelected(null);
    setQuery('');
    setStatus(null);
  };

  const parent: Location | null = here.path.length
    ? { place: here.place, path: here.path.slice(0, -1) }
    : here.place === 'Local Disk (C:)'
      ? { place: 'This PC', path: [] }
      : null;

  const open = (entry: DemoEntry) => {
    if (entry.sealed) setStatus(demoHints.filesSealed(entry.name));
    else if (isFolder(entry)) go({ place: here.place, path: [...here.path, entry.name] });
    else setStatus(demoHints.launch(entry.name.replace(/\.[^.]+$/, '')));
  };

  const crumbs = [
    ...baseCrumbs(here.place),
    ...here.path.map((name, i) => ({ label: name, to: { place: here.place, path: here.path.slice(0, i + 1) } })),
  ];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      e.stopPropagation();
      filterRef.current?.focus();
      return;
    }
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === 'Enter' && selected) {
      const entry = entries.find((x) => x.name === selected);
      if (entry) open(entry);
    } else if (e.key === 'Backspace' && parent) {
      go(parent);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const i = entries.findIndex((x) => x.name === selected);
      const next = entries[Math.min(entries.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))];
      if (next) setSelected(next.name);
    }
  };

  const emptyText = query ? 'No items match.' : 'This folder is empty.';

  return (
    <div className={`alc-app ${themeClass} alc-files`} data-frosted={frosted || undefined} onKeyDown={onKeyDown}>
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
        {onClose ? (
          <button type="button" className="alc-files-cap" aria-label="Close Alcove Files" onClick={onClose}>
            <X size={14} />
          </button>
        ) : (
          <span className="alc-files-cap">
            <X size={14} />
          </span>
        )}
      </div>

      <div className="alc-files-toolbar">
        <button type="button" className="alc-files-btn" aria-label="Back" data-disabled={history.at === 0 || undefined} disabled={history.at === 0} onClick={() => step(-1)}>
          <ArrowLeft size={14} />
        </button>
        <button
          type="button"
          className="alc-files-btn"
          aria-label="Forward"
          data-disabled={history.at === history.stack.length - 1 || undefined}
          disabled={history.at === history.stack.length - 1}
          onClick={() => step(1)}
        >
          <ArrowRight size={14} />
        </button>
        <button type="button" className="alc-files-btn" aria-label="Up" data-disabled={!parent || undefined} disabled={!parent} onClick={() => parent && go(parent)}>
          <ArrowUp size={14} />
        </button>
        <div className="alc-files-address">
          <div className="alc-files-crumbs">
            {crumbs.map((c, i) => {
              const current = i === crumbs.length - 1;
              const to = c.to;
              return (
                <span key={`${i}-${c.label}`} style={{ display: 'contents' }}>
                  {i > 0 && <span className="alc-files-sep">/</span>}
                  {to && !current ? (
                    <button type="button" className="alc-files-crumb alc-files-trunc" onClick={() => go(to)}>
                      {c.label}
                    </button>
                  ) : (
                    <span className="alc-files-crumb alc-files-trunc" data-current={current || undefined}>
                      {c.label}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
        <button type="button" className="alc-files-btn" aria-label="List view" aria-pressed={view === 'list'} data-active={view === 'list' || undefined} onClick={() => setView('list')}>
          <List size={14} />
        </button>
        <button type="button" className="alc-files-btn" aria-label="Grid view" aria-pressed={view === 'grid'} data-active={view === 'grid' || undefined} onClick={() => setView('grid')}>
          <LayoutGrid size={14} />
        </button>
        <button
          type="button"
          className="alc-files-btn"
          aria-label={showHidden ? 'Hide hidden items' : 'Show hidden items'}
          aria-pressed={showHidden}
          data-active={showHidden || undefined}
          onClick={() => setShowHidden((v) => !v)}
        >
          {showHidden ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <label className="alc-files-filter">
          <Search size={12} />
          <input ref={filterRef} className="alc-files-filter-box" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter..." aria-label="Filter items" />
          {!query && <kbd>Ctrl+F</kbd>}
        </label>
      </div>

      <div className="alc-files-body">
        <nav className="alc-files-sidebar" aria-label="Places">
          {sidebar.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                {'group' in item && i > 0 && <div className="alc-files-divider" />}
                <button
                  type="button"
                  className="alc-files-place"
                  data-active={(here.place === item.label && here.path.length === 0) || undefined}
                  onClick={() => go({ place: item.label, path: [] })}
                >
                  <Icon size={14} />
                  <span className="alc-files-trunc">{item.label}</span>
                </button>
              </div>
            );
          })}
        </nav>

        <div className="alc-files-pane">
          {atPc && (
            <div className="alc-files-pc">
              <p className="alc-files-pc-label">Drives</p>
              <div className="alc-files-drives" role="listbox" aria-label="Drives">
                {entries.map((entry) => {
                  const drive = demoDrives.find((d) => d.name === entry.name);
                  const isSelected = entry.name === selected;
                  return (
                    <div
                      key={entry.name}
                      className="alc-files-drive"
                      role="option"
                      aria-selected={isSelected}
                      data-selected={isSelected || undefined}
                      onClick={() => setSelected(entry.name)}
                      onDoubleClick={() => open(entry)}
                    >
                      <HardDrive size={22} strokeWidth={1.5} />
                      <span className="alc-files-drive-text">
                        <span className="alc-files-trunc">{entry.name}</span>
                        <span className="alc-files-drive-bar">
                          <span style={{ width: `${drive?.used ?? 0}%` }} />
                        </span>
                        <span className="alc-files-drive-free">
                          {drive?.free} free of {drive?.total}
                        </span>
                      </span>
                    </div>
                  );
                })}
                {entries.length === 0 && <p className="alc-files-empty">{emptyText}</p>}
              </div>
            </div>
          )}
          {!atPc && view === 'list' && (
            <div className="alc-files-head">
              <div style={{ width: 16, flexShrink: 0 }} />
              {columns.map((col) => (
                <button
                  key={col.key}
                  type="button"
                  className="alc-files-col"
                  data-w={col.key}
                  onClick={() => setSort((s) => ({ key: col.key, dir: s.key === col.key && s.dir === 'asc' ? 'desc' : 'asc' }))}
                >
                  {col.label}
                  {sort.key === col.key && (sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </button>
              ))}
            </div>
          )}
          {!atPc && (
          <div className={view === 'list' ? 'alc-files-list' : 'alc-files-grid'} role="listbox" aria-label="Items" tabIndex={-1}>
            {entries.map((entry) => {
              const isSelected = entry.name === selected;
              const common = {
                role: 'option',
                'aria-selected': isSelected,
                'data-selected': isSelected || undefined,
                'data-hidden': entry.hidden || undefined,
                title: entry.name,
                onClick: () => setSelected(entry.name),
                onDoubleClick: () => open(entry),
              } as const;
              return view === 'list' ? (
                <div key={entry.name} className="alc-files-row" {...common}>
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
              ) : (
                <div key={entry.name} className="alc-files-tile" {...common}>
                  <span className="alc-files-tile-icon">
                    <EntryIcon entry={entry} size={40} thumb />
                  </span>
                  <span className="alc-files-tile-name">{entry.name}</span>
                </div>
              );
            })}
            {entries.length === 0 && <p className="alc-files-empty">{emptyText}</p>}
          </div>
          )}
        </div>
      </div>

      <div className="alc-files-status">
        {status ? (
          <span className="alc-files-trunc">{status}</span>
        ) : (
          <>
            <span>{entries.length} items</span>
            {selected && <span>1 selected</span>}
          </>
        )}
        <span className="alc-files-grow" />
        <span>{FREE_SPACE}</span>
      </div>
    </div>
  );
}
