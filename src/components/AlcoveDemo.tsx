import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import DemoTitleBar from './DemoTitleBar';
import DemoToolbar from './DemoToolbar';
import DemoTile from './DemoTile';
import DemoPeek from './DemoPeek';
import DemoShelf from './DemoShelf';
import type { ShelfEntry } from './DemoShelf';
import DemoThemeMenu from './DemoThemeMenu';
import Keycap from './Keycap';
import { DEMO_TILE, DEMO_TILE_COMPACT, demoHints, demoHome, demoHotkeys } from '../config/demo';
import type { Cell, DemoFile, DemoFolder, DemoItem } from '../config/demo';
import { setSiteTheme, themeById, useSiteThemeId } from '../config/themes';
import '../styles/app-themes.css';

type Layout = Record<string, Cell>;

interface State {
  open: boolean;
  folder: string | null;
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
}

type Action =
  | { type: 'toggle' }
  | { type: 'show' }
  | { type: 'hide' }
  | { type: 'enter'; folder: string | null }
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
  | { type: 'escape' };

const initial: State = {
  open: true,
  folder: null,
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
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'toggle':
      return { ...s, open: !s.open, menu: false, peek: null };
    case 'show':
      return { ...s, open: true };
    case 'hide':
      return { ...s, open: false, menu: false, peek: null };
    case 'enter':
      if (a.folder === s.folder) return s;
      return { ...s, folder: a.folder, loading: a.folder !== null, focused: null, peek: null, query: '' };
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
    case 'escape':
      if (s.shelf) return { ...s, shelf: false };
      if (s.menu) return { ...s, menu: false };
      if (s.peek) return { ...s, peek: null };
      if (s.query) return { ...s, query: '' };
      if (s.folder) return { ...s, folder: null, focused: null };
      return s;
  }
}

const same = (a: Cell, b: Cell) => a[0] === b[0] && a[1] === b[1];

function placeItems(items: DemoItem[], cols: number, rows: number): Layout {
  const fits = items.every((i) => i.cell[0] < cols && i.cell[1] < rows);
  if (fits) return Object.fromEntries(items.map((i) => [i.id, i.cell]));
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

  const folder = s.folder ? (demoHome.find((i) => i.id === s.folder) as DemoFolder) : null;
  const items: DemoItem[] = folder ? folder.items : demoHome;
  const key = `${s.folder ?? 'home'}:${size.cols}x${size.rows}`;
  const layout = s.layouts[key] ?? placeItems(items, size.cols, size.rows);
  const q = s.query.trim().toLowerCase();
  const visible = q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;

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
    if (item.kind === 'folder') {
      dispatch({ type: 'enter', folder: item.id });
      dispatch({ type: 'hint', text: demoHints.folder });
    } else if (item.kind === 'file') {
      dispatch({ type: 'focus', id: item.id });
      dispatch({ type: 'peek', id: item.id });
      dispatch({ type: 'hint', text: demoHints.peek });
    } else {
      dispatch({ type: 'focus', id: item.id });
      dispatch({ type: 'hint', text: demoHints.launch(item.label) });
    }
  }, []);

  const pickTheme = useCallback((id: string) => {
    setSiteTheme(id);
    const t = themeById(id);
    if (t) dispatch({ type: 'hint', text: demoHints.theme(t.name) });
  }, []);

  const shelfItems = useMemo(
    () =>
      demoHome.flatMap((i) => [
        { item: i, where: 'Home' },
        ...(i.kind === 'folder' ? i.items.map((c) => ({ item: c as DemoItem, where: i.label })) : []),
      ]),
    [],
  );

  const shelfOpen = (e: ShelfEntry) => {
    dispatch({ type: 'shelf', open: false });
    if (e.kind === 'theme') {
      pickTheme(e.id);
      return;
    }
    dispatch({ type: 'show' });
    const parent = demoHome.find((h) => h.kind === 'folder' && h.items.some((c) => c.id === e.item.id));
    dispatch({ type: 'enter', folder: parent ? parent.id : null });
    open(e.item);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const inDemo = !!grid.current?.closest('.ad-stage')?.matches(':hover, :focus-within');
      if (mod && e.code === 'Space') {
        e.preventDefault();
        if (e.shiftKey) dispatch({ type: 'shelf', open: !s.shelf });
        else dispatch({ type: 'toggle' });
      } else if (e.key === 'Escape') {
        dispatch({ type: 'escape' });
      } else if (s.open && inDemo && mod && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        search.current?.focus();
      } else if (s.open && inDemo && mod && e.key.toLowerCase() === 'p' && s.focused) {
        const item = items.find((i) => i.id === s.focused);
        if (item?.kind === 'file') {
          e.preventDefault();
          open(item);
        }
      }
    };
    const onPress = (e: Event) => {
      if ((e as CustomEvent<string>).detail === 'shelf') dispatch({ type: 'shelf', open: !s.shelf });
      else dispatch({ type: 'toggle' });
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('alcove-demo', onPress);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('alcove-demo', onPress);
    };
  }, [s.shelf, s.open, s.focused, items, open]);

  const peekFile = s.peek ? (items.find((i) => i.id === s.peek) as DemoFile | undefined) : undefined;
  const radius = theme?.corners === 'square' ? 0 : theme?.corners === 'small' ? 4 : 8;

  return (
    <div className="ad-stage" data-intro-target style={{ '--ad-corner': `${radius}px` } as React.CSSProperties}>
      {s.open ? (
        <div
          className={`ad-app ${themeClass} ad-window`}
          data-translucent={theme?.translucent || undefined}
          role="application"
          aria-label="Alcove demo"
        >
          <div className="scene-layer" aria-hidden="true" />
          <DemoTitleBar
            hint={s.hint.text}
            hintVisible={hintVisible}
            menuOpen={s.menu}
            onShelf={() => dispatch({ type: 'shelf', open: true })}
            onSettings={() => dispatch({ type: 'menu', open: !s.menu })}
            onHide={() => dispatch({ type: 'hide' })}
          >
            {s.menu && <DemoThemeMenu activeId={themeId} onPick={pickTheme} />}
          </DemoTitleBar>
          <DemoToolbar
            ref={search}
            folderLabel={folder?.label ?? null}
            query={s.query}
            muted={s.muted}
            volume={s.volume}
            audioOpen={s.audioOpen}
            powerOpen={s.powerOpen}
            onHome={() => dispatch({ type: 'enter', folder: null })}
            onQuery={(v) => dispatch({ type: 'query', q: v })}
            onMute={() => {
              dispatch({ type: 'mute' });
              if (!s.muted) hint(demoHints.muted);
            }}
            onVolume={(v) => dispatch({ type: 'volume', v })}
            onToggleAudio={() => dispatch({ type: 'audio' })}
            onTogglePower={() => dispatch({ type: 'power' })}
            onPower={() => hint(demoHints.power)}
          />
          <div
            ref={grid}
            className="ad-grid grid-surface"
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
              <span className="ad-spinner" role="status" aria-label="Loading" />
            ) : (
              visible.map((item) => (
                <DemoTile
                  key={`${s.folder ?? 'home'}:${item.id}`}
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
          {peekFile && (
            <div
              className="ad-peek-layer"
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) dispatch({ type: 'peek', id: null });
              }}
            >
              <DemoPeek file={peekFile} themeClass={themeClass} onClose={() => dispatch({ type: 'peek', id: null })} />
            </div>
          )}
        </div>
      ) : (
        <div className="ad-desktop">
          <p>Hidden. It is one keypress away.</p>
          <button type="button" className="ad-summon" onClick={() => dispatch({ type: 'show' })}>
            <Keycap keys={demoHotkeys.window} /> brings it back
          </button>
        </div>
      )}
      {s.shelf && (
        <div className="ad-shelf-wrap">
          <DemoShelf
            items={shelfItems}
            themeClass={themeClass}
            onOpen={shelfOpen}
            onClose={() => dispatch({ type: 'shelf', open: false })}
          />
        </div>
      )}
    </div>
  );
}
