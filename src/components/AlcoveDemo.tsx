import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import DemoTitleBar from './DemoTitleBar';
import DemoToolbar from './DemoToolbar';
import DemoCrumbs from './DemoCrumbs';
import DemoTile from './DemoTile';
import DemoPeek from './DemoPeek';
import DemoPeekContent from './DemoPeekContent';
import DemoEntryPeek from './DemoEntryPeek';
import DemoShelf from './DemoShelf';
import type { ShelfEntry } from './DemoShelf';
import DemoThemeMenu from './DemoThemeMenu';
import DemoColumnHeaders from './DemoColumnHeaders';
import type { SortColumn, SortDir } from './DemoColumnHeaders';
import DemoFileList from './DemoFileList';
import DemoSticky from './DemoSticky';
import Keycap from './Keycap';
import { DEMO_TILE, DEMO_TILE_COMPACT, demoHints, demoHome, demoHotkeys, demoTasks } from '../config/demo';
import type { Cell, DemoEntry, DemoFolder, DemoItem, DemoTaskId } from '../config/demo';
import { setSiteTheme, themeById, useSiteThemeId } from '../config/themes';
import '../styles/app-themes.css';

type Layout = Record<string, Cell>;

interface State {
  open: boolean;
  folder: string | null;
  sub: string[];
  sort: { column: SortColumn; dir: SortDir };
  loading: boolean;
  layouts: Record<string, Layout>;
  focused: string | null;
  peek: string | null;
  shelf: boolean;
  menu: boolean;
  hint: { text: string; n: number };
  query: string;
  muted: boolean;
  volume: number;
  audioOpen: boolean;
  powerOpen: boolean;
  toolbar: boolean;
  done: DemoTaskId[];
}

type Action =
  | { type: 'toggle' }
  | { type: 'show' }
  | { type: 'hide' }
  | { type: 'enter'; folder: string | null }
  | { type: 'sub'; path: string[] }
  | { type: 'push'; segment: string }
  | { type: 'sort'; column: SortColumn }
  | { type: 'loaded' }
  | { type: 'move'; key: string; layout: Layout; id: string; to: Cell }
  | { type: 'focus'; id: string | null }
  | { type: 'peek'; id: string | null }
  | { type: 'shelf'; open: boolean }
  | { type: 'menu'; open: boolean }
  | { type: 'hint'; text: string }
  | { type: 'query'; q: string }
  | { type: 'mute' }
  | { type: 'volume'; v: number }
  | { type: 'audio' }
  | { type: 'power' }
  | { type: 'theme' }
  | { type: 'toolbar' }
  | { type: 'escape' };

const initial: State = {
  open: true,
  folder: null,
  sub: [],
  sort: { column: 'name', dir: 'asc' },
  loading: false,
  layouts: {},
  focused: null,
  peek: null,
  shelf: false,
  menu: false,
  hint: { text: demoHints.start, n: 0 },
  query: '',
  muted: false,
  volume: 64,
  audioOpen: false,
  powerOpen: false,
  toolbar: true,
  done: [],
};

function step(s: State, a: Action): State {
  switch (a.type) {
    case 'toggle':
      return { ...s, open: !s.open, menu: false, peek: null };
    case 'show':
      return { ...s, open: true };
    case 'hide':
      return { ...s, open: false, menu: false, peek: null };
    case 'enter':
      if (a.folder === s.folder) return s;
      return { ...s, folder: a.folder, sub: [], loading: a.folder !== null, focused: null, peek: null, query: '' };
    case 'sub':
      return { ...s, sub: a.path, loading: true, focused: null, query: '', peek: null };
    case 'push':
      return { ...s, sub: [...s.sub, a.segment], loading: true, focused: null, query: '', peek: null };
    case 'sort':
      return {
        ...s,
        sort: { column: a.column, dir: s.sort.column === a.column && s.sort.dir === 'asc' ? 'desc' : 'asc' },
      };
    case 'loaded':
      return { ...s, loading: false };
    case 'move':
      return { ...s, layouts: { ...s.layouts, [a.key]: { ...a.layout, [a.id]: a.to } }, focused: a.id };
    case 'focus':
      return s.focused === a.id ? s : { ...s, focused: a.id };
    case 'peek':
      return { ...s, peek: a.id };
    case 'shelf':
      return { ...s, shelf: a.open, menu: false };
    case 'menu':
      return { ...s, menu: a.open };
    case 'hint':
      return { ...s, hint: { text: a.text, n: s.hint.n + 1 } };
    case 'query':
      return { ...s, query: a.q };
    case 'mute':
      return { ...s, muted: !s.muted };
    case 'volume':
      return { ...s, volume: a.v, muted: false };
    case 'audio':
      return { ...s, audioOpen: !s.audioOpen };
    case 'power':
      return { ...s, powerOpen: !s.powerOpen };
    case 'theme':
      return s;
    case 'toolbar':
      return { ...s, toolbar: !s.toolbar };
    case 'escape':
      if (s.shelf) return { ...s, shelf: false };
      if (s.menu) return { ...s, menu: false };
      if (s.peek) return { ...s, peek: null };
      if (s.query) return { ...s, query: '' };
      if (s.sub.length) return { ...s, sub: s.sub.slice(0, -1) };
      if (s.folder) return { ...s, folder: null, focused: null };
      return s;
  }
}

function taskFor(s: State, a: Action): DemoTaskId | null {
  switch (a.type) {
    case 'move':
      return 'drag';
    case 'enter':
      return a.folder ? 'folder' : null;
    case 'push':
      return 'nested';
    case 'peek':
      return a.id ? 'peek' : null;
    case 'toggle':
      return s.open ? 'hide' : null;
    case 'hide':
      return 'hide';
    case 'shelf':
      return a.open ? 'shelf' : null;
    case 'theme':
      return 'theme';
    default:
      return null;
  }
}

function reducer(s: State, a: Action): State {
  const next = step(s, a);
  const task = taskFor(s, a);
  return task && !next.done.includes(task) ? { ...next, done: [...next.done, task] } : next;
}

const same = (a: Cell, b: Cell) => a[0] === b[0] && a[1] === b[1];

function pathTo(id: string, list: DemoItem[] = demoHome, trail: string[] = []): string[] | null {
  for (const item of list) {
    if (item.id === id) return trail;
    if (item.kind === 'folder') {
      const found = pathTo(id, item.items, [...trail, item.id]);
      if (found) return found;
    }
  }
  return null;
}

const flatten = (list: DemoItem[], where: string): { item: DemoItem; where: string }[] =>
  list.flatMap((item) => [{ item, where }, ...(item.kind === 'folder' ? flatten(item.items, item.label) : [])]);

function sortEntries(entries: DemoEntry[], column: SortColumn, dir: SortDir): DemoEntry[] {
  return [...entries].sort((a, b) => {
    if (!a.entries !== !b.entries) return a.entries ? -1 : 1;
    const cmp = column === 'size' ? a.size - b.size : column === 'name' ? a.name.localeCompare(b.name) : a[column].localeCompare(b[column]);
    return dir === 'asc' ? cmp : -cmp;
  });
}

function placeItems(items: DemoItem[], cols: number, rows: number): Layout {
  const fits = (cell?: Cell) => !!cell && cell[0] < cols && cell[1] < rows;
  if (items.every((i) => fits(i.cell))) return Object.fromEntries(items.map((i) => [i.id, i.cell]));
  if (items.every((i) => fits(i.compact))) return Object.fromEntries(items.map((i) => [i.id, i.compact!]));
  const ordered = [...items].sort((a, b) => a.cell[1] - b.cell[1] || a.cell[0] - b.cell[0]);
  return Object.fromEntries(ordered.map((i, n) => [i.id, [n % cols, Math.floor(n / cols)] as Cell]));
}

function neighbour(layout: Layout, from: Cell, dx: number, dy: number, skip: string): string | null {
  let best: string | null = null;
  let bestScore = Infinity;
  for (const [id, [c, r]] of Object.entries(layout)) {
    if (id === skip) continue;
    const along = dx ? (c - from[0]) * dx : (r - from[1]) * dy;
    const across = dx ? Math.abs(r - from[1]) : Math.abs(c - from[0]);
    if (along <= 0) continue;
    const score = along + across * 4;
    if (score < bestScore) {
      bestScore = score;
      best = id;
    }
  }
  return best;
}

function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return compact;
}

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export default function AlcoveDemo() {
  const [s, dispatch] = useReducer(reducer, initial);
  const [hintVisible, setHintVisible] = useState(true);
  const [size, setSize] = useState({ cols: 9, rows: 5 });
  const compact = useCompact();
  const themeId = useSiteThemeId() ?? 'alcove';
  const theme = themeById(themeId);
  const themeClass = `theme-${themeId}`;
  const grid = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const tile = compact ? DEMO_TILE_COMPACT : DEMO_TILE;

  const top = s.folder ? (demoHome.find((i) => i.id === s.folder) as DemoFolder) : null;
  const chain = top
    ? top.link
      ? [top]
      : s.sub.reduce<DemoFolder[]>((list, id) => {
          const next = list[list.length - 1].items.find((i) => i.id === id && i.kind === 'folder');
          return next ? [...list, next as DemoFolder] : list;
        }, [top])
    : [];
  const folder = chain[chain.length - 1] ?? null;
  const items: DemoItem[] = folder ? folder.items : demoHome;
  const where = [s.folder ?? 'home', ...s.sub].join('/');
  const key = `${where}:${size.cols}x${size.rows}`;
  const layout = s.layouts[key] ?? placeItems(items, size.cols, size.rows);
  const q = s.query.trim().toLowerCase();
  const visible = q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
  const entries = top?.link
    ? s.sub.reduce<DemoEntry[]>((list, name) => list.find((e) => e.name === name)?.entries ?? [], top.link.entries)
    : null;
  const listed = entries
    ? sortEntries(q ? entries.filter((e) => e.name.toLowerCase().includes(q)) : entries, s.sort.column, s.sort.dir)
    : [];

  const isFree = (to: Cell, id: string) =>
    to[0] >= 0 &&
    to[1] >= 0 &&
    to[0] < size.cols &&
    to[1] < size.rows &&
    !Object.entries(layout).some(([other, c]) => other !== id && same(c, to));

  useLayoutEffect(() => {
    const el = grid.current;
    if (!el) return;
    const measure = () => {
      const style = getComputedStyle(el);
      const w = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const h = el.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const cols = Math.max(3, Math.floor(w / tile));
      const rows = Math.max(3, Math.floor(h / tile));
      setSize((p) => (p.cols === cols && p.rows === rows ? p : { cols, rows }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tile, s.open]);

  useEffect(() => {
    setHintVisible(true);
    const t = setTimeout(() => setHintVisible(false), 7000);
    return () => clearTimeout(t);
  }, [s.hint.n]);

  useEffect(() => {
    if (!s.loading) return;
    const t = setTimeout(() => dispatch({ type: 'loaded' }), 160);
    return () => clearTimeout(t);
  }, [s.loading]);

  const hint = (text: string) => dispatch({ type: 'hint', text });

  const open = useCallback((item: DemoItem) => {
    if (item.kind === 'folder' && !demoHome.includes(item)) {
      dispatch({ type: 'push', segment: item.id });
      dispatch({ type: 'hint', text: demoHints.parent });
    } else if (item.kind === 'folder') {
      dispatch({ type: 'enter', folder: item.id });
      dispatch({ type: 'hint', text: item.link ? demoHints.linked : demoHints.folder });
    } else if (item.kind === 'file') {
      dispatch({ type: 'focus', id: item.id });
      dispatch({ type: 'hint', text: demoHints.launchFile(item.label.replace(/\.[^.]+$/, '')) });
    } else {
      dispatch({ type: 'focus', id: item.id });
      dispatch({ type: 'hint', text: demoHints.launch(item.label) });
    }
  }, []);

  const openEntry = (entry: DemoEntry) => {
    if (entry.entries) {
      dispatch({ type: 'push', segment: entry.name });
      hint(demoHints.parent);
    } else {
      dispatch({ type: 'focus', id: entry.name });
      hint(demoHints.launchFile(entry.name.replace(/\.[^/.]+$/, '')));
    }
  };

  const pickTheme = useCallback((id: string) => {
    setSiteTheme(id);
    dispatch({ type: 'theme' });
    const t = themeById(id);
    if (t) dispatch({ type: 'hint', text: demoHints.theme(t.name) });
  }, []);

  const shelfItems = useMemo(() => flatten(demoHome, 'Home'), []);

  const shelfOpen = (e: ShelfEntry) => {
    if (e.kind === 'theme') {
      pickTheme(e.id);
      return;
    }
    dispatch({ type: 'shelf', open: false });
    dispatch({ type: 'show' });
    const path = pathTo(e.item.id) ?? [];
    dispatch({ type: 'enter', folder: path[0] ?? null });
    if (path.length) dispatch({ type: 'sub', path: path.slice(1) });
    open(e.item);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const inDemo = !!grid.current?.closest('.alc-stage')?.matches(':hover, :focus-within');
      if (mod && e.code === 'Space') {
        e.preventDefault();
        if (e.shiftKey) dispatch({ type: 'shelf', open: !s.shelf });
        else dispatch({ type: 'toggle' });
      } else if (e.key === 'Escape') {
        dispatch({ type: 'escape' });
      } else if (s.open && inDemo && mod && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        search.current?.focus();
      } else if (s.open && inDemo && mod && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        peekSelected();
      }
    };
    const peekSelected = () => {
      if (!s.open) return;
      if (s.peek) {
        dispatch({ type: 'peek', id: null });
        return;
      }
      const selected = entries ? entries.some((e) => e.name === s.focused) : items.some((i) => i.id === s.focused);
      if (!selected) {
        dispatch({ type: 'hint', text: demoHints.pickFirst });
        return;
      }
      dispatch({ type: 'peek', id: s.focused });
      dispatch({ type: 'hint', text: demoHints.peek });
    };
    const onPress = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === 'shelf') dispatch({ type: 'shelf', open: !s.shelf });
      else if (detail === 'peek') peekSelected();
      else dispatch({ type: 'toggle' });
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('alcove-demo', onPress);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('alcove-demo', onPress);
    };
  }, [s.shelf, s.open, s.focused, s.peek, items, entries, open]);

  const crumbs = top?.link ? [top.label, ...s.sub] : chain.map((f) => f.label);
  const onCrumb = (i: number) =>
    i < 0 ? dispatch({ type: 'enter', folder: null }) : dispatch({ type: 'sub', path: s.sub.slice(0, i) });

  useEffect(() => {
    if (!s.menu && !s.shelf) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element;
      if (target.closest('[data-demo]')) return;
      if (s.menu && !target.closest('.alc-menu, .alc-menu-toggle')) dispatch({ type: 'menu', open: false });
      if (s.shelf && !target.closest('.alc-shelf')) dispatch({ type: 'shelf', open: false });
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [s.menu, s.shelf]);

  const peekItem = s.peek && !entries ? items.find((i) => i.id === s.peek) : undefined;
  const peekEntry = s.peek && entries ? entries.find((e) => e.name === s.peek) : undefined;
  const radius = theme?.corners === 'square' ? 0 : theme?.corners === 'small' ? 4 : 8;

  return (
    <div className="alc-stage" data-intro-target style={{ '--alc-corner': `${radius}px` } as React.CSSProperties}>
      {s.open ? (
        <div
          className={`alc-app ${themeClass} alc-window`}
          data-translucent={theme?.translucent || undefined}
          role="application"
          aria-label="Alcove demo"
        >
          <div className="scene-layer" aria-hidden="true" />
          <DemoTitleBar
            hint={s.hint.text}
            hintVisible={hintVisible}
            menuOpen={s.menu}
            toolbarVisible={s.toolbar}
            onToggleToolbar={() => dispatch({ type: 'toolbar' })}
            onShelf={() => dispatch({ type: 'shelf', open: true })}
            onSettings={() => dispatch({ type: 'menu', open: !s.menu })}
            onHide={() => dispatch({ type: 'hide' })}
          >
            {s.menu && <DemoThemeMenu activeId={themeId} onPick={pickTheme} />}
          </DemoTitleBar>
          {s.toolbar ? (
          <DemoToolbar
            ref={search}
            crumbs={crumbs}
            query={s.query}
            muted={s.muted}
            volume={s.volume}
            audioOpen={s.audioOpen}
            powerOpen={s.powerOpen}
            onCrumb={onCrumb}
            onQuery={(v) => dispatch({ type: 'query', q: v })}
            onMute={() => {
              dispatch({ type: 'mute' });
              if (!s.muted) hint(demoHints.muted);
            }}
            onVolume={(v) => dispatch({ type: 'volume', v })}
            onToggleAudio={() => dispatch({ type: 'audio' })}
            onTogglePower={() => dispatch({ type: 'power' })}
            onPower={() => hint(demoHints.power)}
            onOutput={() => hint(demoHints.output)}
            onMixer={() => hint(demoHints.mixer)}
          />
          ) : (
            folder && (
              <div className="alc-crumbbar">
                <DemoCrumbs crumbs={crumbs} onCrumb={onCrumb} />
              </div>
            )
          )}
          {entries && entries.length > 0 && (
            <DemoColumnHeaders
              column={s.sort.column}
              dir={s.sort.dir}
              onSort={(column) => dispatch({ type: 'sort', column })}
            />
          )}
          <div
            ref={grid}
            className="alc-grid grid-surface"
            data-list={entries ? '' : undefined}
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) dispatch({ type: 'focus', id: null });
            }}
            onKeyDown={(e) => {
              const dir = ARROWS[e.key];
              if (!dir || !s.focused || !layout[s.focused]) return;
              e.preventDefault();
              const shown = Object.fromEntries(Object.entries(layout).filter(([id]) => visible.some((v) => v.id === id)));
              const next = neighbour(shown, layout[s.focused], dir[0], dir[1], s.focused);
              if (next) grid.current?.querySelector<HTMLButtonElement>(`[data-id="${next}"]`)?.focus();
            }}
          >
            {s.loading ? (
              <span className="alc-spinner" role="status" aria-label="Loading" />
            ) : entries ? (
              <DemoFileList
                entries={listed}
                focused={s.focused}
                onFocus={(name) => dispatch({ type: 'focus', id: name })}
                onOpen={openEntry}
              />
            ) : (
              visible.map((item) => (
                <DemoTile
                  key={`${where}:${item.id}`}
                  item={item}
                  cell={layout[item.id]}
                  tile={tile}
                  focused={s.focused === item.id}
                  canDrop={(to) => isFree(to, item.id)}
                  onFocus={() => dispatch({ type: 'focus', id: item.id })}
                  onOpen={() => open(item)}
                  onMove={(to) => {
                    if (same(to, layout[item.id])) return;
                    if (!isFree(to, item.id)) {
                      hint(demoHints.blocked);
                      return;
                    }
                    dispatch({ type: 'move', key, layout, id: item.id, to });
                    hint(demoHints.moved);
                  }}
                />
              ))
            )}
          </div>
          {(peekItem || peekEntry) && (
            <div
              className="alc-peek-layer"
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) dispatch({ type: 'peek', id: null });
              }}
            >
              <DemoPeek
                title={peekItem ? peekItem.label : peekEntry!.name}
                path={
                  peekItem
                    ? peekItem.kind === 'file'
                      ? peekItem.path
                      : peekItem.kind === 'app'
                        ? peekItem.target
                        : peekItem.label
                    : [top!.link!.path, ...s.sub, peekEntry!.name].join('\\')
                }
                themeClass={themeClass}
                onClose={() => dispatch({ type: 'peek', id: null })}
              >
                {peekItem ? <DemoPeekContent item={peekItem} /> : <DemoEntryPeek entry={peekEntry!} />}
              </DemoPeek>
            </div>
          )}
        </div>
      ) : (
        <div className="alc-desktop">
          <div className="alc-desktop-card">
            <p>Hidden. It is one keypress away.</p>
            <button type="button" className="alc-summon" onClick={() => dispatch({ type: 'show' })}>
              <Keycap keys={demoHotkeys.window} /> brings it back
            </button>
          </div>
        </div>
      )}
      {s.shelf && (
        <div className="alc-shelf-wrap">
          <DemoShelf
            items={shelfItems}
            themeClass={themeClass}
            onOpen={shelfOpen}
            onClose={() => dispatch({ type: 'shelf', open: false })}
          />
        </div>
      )}
      <DemoSticky tasks={demoTasks} done={s.done} />
    </div>
  );
}
