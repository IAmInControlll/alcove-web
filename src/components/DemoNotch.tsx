import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import DemoNotchFooter from './DemoNotchFooter';
import DemoNotchWidget from './DemoNotchWidget';
import type { NotchWidgetContext, NotchWidgetId } from './DemoNotchWidget';
import { demoHints, demoIcon, demoNotchTracks, filterPins, type DemoPin } from '../config/demo';

export type NotchStage = 'closed' | 'compact' | 'expanded';

interface Props {
  stage: NotchStage;
  themeClass: string;
  frosted: boolean;
  keepAwake: boolean;
  onExpand: () => void;
  onCompact?: () => void;
  onAlcove: () => void;
  onShelf: () => void;
  onHint: (text: string) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  pinned?: DemoPin[];
}

/** The app's measurements in DIPs (notch/geometry.ts and board.ts): stage 1
 *  with nothing pinned is the media glance alone; stage 2 is a 4-column apps
 *  side, the divider, and a 4-column board on one 80-DIP grid. */
const CELL = 80;
const GAP = 8;
const span = (n: number) => n * CELL + (n - 1) * GAP;
const BOARD_ROWS = 5;
const COMPACT = { width: 448, height: 64 };
const EXPANDED = { width: 2 * 16 + span(4) + 17 + span(4), height: 16 + span(BOARD_ROWS) + 44 };

const board: { id: NotchWidgetId; x: number; y: number; w: number; h: number }[] = [
  { id: 'clock', x: 0, y: 0, w: 2, h: 1 },
  { id: 'explorer', x: 2, y: 0, w: 1, h: 1 },
  { id: 'power', x: 3, y: 0, w: 1, h: 1 },
  { id: 'system', x: 0, y: 1, w: 2, h: 2 },
  { id: 'clipboard', x: 2, y: 1, w: 2, h: 2 },
  { id: 'media', x: 0, y: 3, w: 4, h: 2 },
];

const time = (d: Date) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
const shortDate = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const drift = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v + (Math.random() - 0.5) * 8));

export default function DemoNotch(p: Props) {
  const open = p.stage !== 'closed';
  const [drawn, setDrawn] = useState<'compact' | 'expanded'>('compact');
  const [opened, setOpened] = useState(false);
  const [entry, setEntry] = useState<NotchStage>('closed');
  const [now, setNow] = useState<Date | null>(null);
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [sys, setSys] = useState({ cpu: 12, memory: 46, gpu: 8 });
  const [scale, setScale] = useState(1);
  const [query, setQuery] = useState('');
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (p.stage === 'closed') {
      setEntry('closed');
      setQuery('');
      return;
    }
    setDrawn(p.stage);
    setOpened(true);
    setEntry((e) => (e === 'closed' ? p.stage : e));
  }, [p.stage]);

  useEffect(() => {
    setNow(new Date());
    if (!open) return;
    const t = setInterval(() => {
      setNow(new Date());
      setSys((s) => ({ cpu: drift(s.cpu, 4, 38), memory: drift(s.memory, 40, 58), gpu: drift(s.gpu, 2, 24) }));
    }, 1500);
    return () => clearInterval(t);
  }, [open]);

  useLayoutEffect(() => {
    const stage = wrap.current?.parentElement;
    if (!stage) return;
    const fit = drawn === 'compact' ? COMPACT : EXPANDED;
    const measure = () =>
      setScale(Math.min(1, (stage.clientWidth * 0.94) / fit.width, (stage.clientHeight - 8) / fit.height));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [drawn]);

  const size = drawn === 'compact' ? COMPACT : EXPANDED;
  const shown = filterPins(p.pinned ?? [], query);
  const swapped = entry !== 'closed' && entry !== drawn ? ' is-swapped' : '';
  const go = (step: number) => {
    const next = (track + step + demoNotchTracks.length) % demoNotchTracks.length;
    setTrack(next);
    setPlaying(true);
    p.onHint(demoHints.notchTrack(demoNotchTracks[next].title));
  };
  const ctx: NotchWidgetContext = {
    now: now ?? new Date(0),
    track: demoNotchTracks[track],
    playing,
    ...sys,
    keepAwake: p.keepAwake,
    onPlay: () => setPlaying((v) => !v),
    onNext: () => go(1),
    onPrevious: () => go(-1),
    onPower: () => p.onHint(demoHints.notchPower),
    onFiles: () => p.onHint(demoHints.notchFiles),
    onClipboard: (text) => p.onHint(demoHints.notchCopied(text)),
    onTaskManager: () => p.onHint(demoHints.launch('Task Manager')),
  };

  return (
    <div ref={wrap} className={`alc-app ${p.themeClass} alc-notch-wrap`} style={{ '--alc-notch-scale': scale } as React.CSSProperties} inert={!open}>
      <div
        className="alc-notch"
        data-open={open || undefined}
        data-frosted={p.frosted || undefined}
        role="dialog"
        aria-label="Notch"
        style={
          {
            '--notch-fill': p.frosted ? 'color-mix(in srgb, var(--popup-bg) 78%, transparent)' : 'var(--popup-bg)',
            width: open ? size.width : size.width * 0.6,
            height: open ? size.height : 0,
          } as React.CSSProperties
        }
        onPointerEnter={p.onPointerEnter}
        onPointerLeave={p.onPointerLeave}
      >
        <span className="alc-notch-ear is-left" aria-hidden="true" />
        <span className="alc-notch-ear is-right" aria-hidden="true" />
        <div className="alc-notch-clip">
          <div className={`alc-notch-content${opened ? ' was-opened' : ''}`} style={{ width: size.width, height: size.height }}>
            {drawn === 'compact' && (
              <div
                key="compact"
                className={`alc-notch-stage alc-notch-compact${swapped}`}
                onClick={(e) => {
                  if (!(e.target as Element).closest('button')) p.onExpand();
                }}
              >
                <div className="alc-notch-glance-row">
                  <DemoNotchWidget id="media" surface="glance" ctx={ctx} />
                  <div className="alc-notch-corner">
                    <span className="alc-nw-sm alc-nw-medium alc-nw-secondary alc-nw-num">{now && time(now)}</span>
                    <span className="alc-nw-xs alc-nw-muted">{now && shortDate(now)}</span>
                  </div>
                </div>
              </div>
            )}
            {now && drawn === 'expanded' && (
              <div
                key="expanded"
                className={`alc-notch-stage alc-notch-expanded${swapped}`}
                onClick={(e) => {
                  if (p.onCompact && !(e.target as Element).closest('button, input, a, [role="button"]')) p.onCompact();
                }}
              >
                <div className="alc-notch-body" style={{ height: 16 + span(BOARD_ROWS) }}>
                  <div className="alc-notch-apps-grid" role="list" style={{ width: span(4) }}>
                    {shown.map((app) => (
                      <button
                        key={app.label}
                        type="button"
                        className="alc-notch-app"
                        role="listitem"
                        onClick={() => p.onHint(demoHints.launch(app.label))}
                      >
                        <img src={demoIcon(app.icon)} alt="" width={26} height={26} />
                        <span className="alc-notch-app-label">{app.label}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      className="alc-notch-app is-add"
                      aria-label="Add files or folders"
                      title="Add files or folders"
                      onClick={() => p.onHint(demoHints.notchAdd)}
                    >
                      <Plus size={20} />
                      <span className="alc-notch-app-label">Add</span>
                    </button>
                  </div>
                  <div className="alc-notch-divider" aria-hidden="true">
                    <span />
                  </div>
                  <div className="alc-notch-board" style={{ width: span(4), height: span(BOARD_ROWS) }}>
                    {board.map((t) => (
                      <div
                        key={t.id}
                        className="alc-notch-tile"
                        style={{ left: t.x * (CELL + GAP), top: t.y * (CELL + GAP), width: span(t.w), height: span(t.h) }}
                      >
                        <DemoNotchWidget id={t.id} surface="board" ctx={ctx} />
                      </div>
                    ))}
                  </div>
                </div>
                <DemoNotchFooter
                  query={query}
                  onQuery={setQuery}
                  onSubmit={() => {
                    if (shown[0]) p.onHint(demoHints.launch(shown[0].label));
                    else if (query.trim()) p.onHint(demoHints.notchNoMatch(query.trim()));
                  }}
                  onAlcove={p.onAlcove}
                  onShelf={p.onShelf}
                  onEdit={() => p.onHint(demoHints.notchEdit)}
                  onSettings={() => p.onHint(demoHints.notchSettings)}
                />
              </div>
            )}
          </div>
        </div>
        {drawn === 'compact' && (
          <button type="button" className="alc-notch-chevron" aria-label="Expand the Notch" title="Expand" onClick={p.onExpand}>
            <ChevronDown size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
