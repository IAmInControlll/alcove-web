import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ClipboardList, FolderOpen, Image, Search } from 'lucide-react';
import { demoDownloads, demoDrives, demoHints, demoIcon, demoNotchClipboard } from '../config/demo';

export type ToolbarPopup = 'downloads' | 'clipboard' | 'system';

interface Props {
  kind: ToolbarPopup;
  onHint: (text: string) => void;
  onFiles: (place?: 'Downloads') => void;
}

const TICK_MS = 1000;
const POINTS = 12;

const meters = [
  { label: 'CPU', of: 0, unit: '', base: 14, swing: 12, span: 10 },
  { label: 'Memory', of: 32, unit: 'GB', base: 38, swing: 3, span: 3 },
  { label: 'GPU', of: 16, unit: 'GB VRAM', base: 9, swing: 8, span: 7 },
];

const detail = (m: (typeof meters)[number], percent: number) => (m.of ? `${((percent * m.of) / 100).toFixed(1)} / ${m.of.toFixed(1)} ${m.unit}` : '');

const wander = (prev: number, base: number, swing: number) => {
  const next = prev + (Math.random() - 0.5) * swing + (base - prev) * 0.3;
  return Math.min(100, Math.max(1, next));
};

const seed = (base: number, swing: number) => {
  const out = [base];
  while (out.length < POINTS) out.push(wander(out[out.length - 1], base, swing));
  return out;
};

const toLine = (series: number[], m: (typeof meters)[number]) =>
  series.map((v, i) => `${((i * 100) / (POINTS - 1)).toFixed(2)},${Math.min(21, Math.max(1, 11 - ((v - m.base) / m.span) * 9)).toFixed(2)}`).join(' ');

function useLive() {
  const [state, setState] = useState(() => ({
    series: meters.map((m) => seed(m.base, m.swing)),
    down: 1.2,
    up: 84,
    disk: 3,
  }));
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setState((s) => ({
        series: s.series.map((line, i) => [...line.slice(1), wander(line[line.length - 1], meters[i].base, meters[i].swing)]),
        down: Math.max(0.1, wander(s.down, 1.2, 0.8)),
        up: Math.max(4, wander(s.up, 84, 40)),
        disk: Math.round(wander(s.disk, 3, 4)),
      }));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);
  return state;
}

function Downloads({ onHint, onFiles }: Omit<Props, 'kind'>) {
  const [dragging, setDragging] = useState<string | null>(null);
  return (
    <>
      <p className="alc-tbp-title">Downloads</p>
      <div className="alc-tbp-grid" role="listbox" aria-label="Downloads, newest first">
        {demoDownloads.map((d) => (
          <button
            key={d.name}
            type="button"
            role="option"
            aria-selected={false}
            className="alc-tbp-tile"
            title={d.name}
            draggable
            data-dragging={dragging === d.name || undefined}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'copy';
              e.dataTransfer.setData('text/plain', d.name);
              setDragging(d.name);
              onHint(demoHints.downloadDrag(d.name));
            }}
            onDragEnd={() => setDragging(null)}
            onClick={() => onHint(demoHints.launch(d.name.replace(/\.[^.]+$/, '')))}
          >
            <img src={demoIcon(d.icon)} alt="" width={30} height={30} draggable={false} />
            <span>{d.name}</span>
          </button>
        ))}
      </div>
      <div className="alc-tbp-foot">
        <button type="button" className="alc-tbp-link" onClick={() => onFiles('Downloads')}>
          <FolderOpen size={12} />
          Open in Alcove Files
        </button>
        <span>{demoDownloads.length} items</span>
      </div>
    </>
  );
}

function Clipboard({ onHint }: Pick<Props, 'onHint'>) {
  const [query, setQuery] = useState('');
  const shown = demoNotchClipboard.filter((c) => c.text.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="alc-tbp-pad">
      <label className="alc-tbp-filter">
        <Search size={12} aria-hidden="true" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter..." aria-label="Filter clipboard history" />
      </label>
      <div className="alc-tbp-list" role="listbox" aria-label="Clipboard history">
        {shown.map((c) => (
          <button key={c.text} type="button" role="option" aria-selected={false} className="alc-tbp-row" onClick={() => onHint(demoHints.notchCopied(c.text))}>
            {c.image && <Image size={14} className="alc-tbp-muted" />}
            <span className="alc-tbp-text">{c.text}</span>
            <span className="alc-tbp-ago">{c.ago}</span>
          </button>
        ))}
        {shown.length === 0 && (
          <p className="alc-tbp-empty">
            <ClipboardList size={18} />
            No items match.
          </p>
        )}
      </div>
      <p className="alc-tbp-note">Click an item to copy it, then paste with Ctrl+V.</p>
    </div>
  );
}

function System({ onHint }: Pick<Props, 'onHint'>) {
  const live = useLive();
  return (
    <div className="alc-tbp-pad alc-tbp-system">
      {meters.map((m, i) => (
        <div key={m.label} className="alc-tbp-meter">
          <div className="alc-tbp-meter-row">
            <span className="alc-tbp-muted">{m.label}</span>
            <span className="alc-tbp-muted alc-tbp-detail">{detail(m, live.series[i][POINTS - 1])}</span>
            <span className="alc-tbp-num">{Math.round(live.series[i][POINTS - 1])}%</span>
          </div>
          <svg viewBox="0 0 100 22" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={toLine(live.series[i], m)} />
          </svg>
        </div>
      ))}
      <span className="alc-tbp-divider" />
      <div className="alc-tbp-meter-row">
        <span className="alc-tbp-muted">Network</span>
        <span className="alc-tbp-num alc-tbp-rate">
          <ArrowDown size={12} />
          {live.down.toFixed(1)} MB/s
        </span>
        <span className="alc-tbp-num alc-tbp-rate">
          <ArrowUp size={12} />
          {Math.round(live.up)} KB/s
        </span>
      </div>
      <div className="alc-tbp-meter-row">
        <span className="alc-tbp-muted">Disk activity</span>
        <span className="alc-tbp-num">{Math.max(0, live.disk)}%</span>
      </div>
      <span className="alc-tbp-divider" />
      <div className="alc-tbp-meter">
        <div className="alc-tbp-meter-row">
          <span className="alc-tbp-muted">C:\</span>
          <span className="alc-tbp-num">
            {demoDrives[0].free} free of {demoDrives[0].total}
          </span>
        </div>
        <span className="alc-tbp-bar">
          <span style={{ width: `${demoDrives[0].used}%` }} />
        </span>
      </div>
      <span className="alc-tbp-divider" />
      <div className="alc-tbp-meter-row">
        <span className="alc-tbp-muted">Up 3d 4h</span>
        <button type="button" className="alc-tbp-link" onClick={() => onHint(demoHints.launch('Task Manager'))}>
          Task Manager
        </button>
      </div>
    </div>
  );
}

export default function DemoToolbarPopup({ kind, onHint, onFiles }: Props) {
  return (
    <div className="alc-tb-popup" data-kind={kind} role="dialog" aria-label={kind === 'system' ? 'System info' : kind === 'downloads' ? 'Downloads' : 'Clipboard history'}>
      {kind === 'downloads' && <Downloads onHint={onHint} onFiles={onFiles} />}
      {kind === 'clipboard' && <Clipboard onHint={onHint} />}
      {kind === 'system' && <System onHint={onHint} />}
    </div>
  );
}
