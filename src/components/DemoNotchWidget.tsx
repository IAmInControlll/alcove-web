import { Coffee, FolderOpen, Image, Music, Pause, Play, Power, SkipBack, SkipForward, SquareArrowOutUpRight } from 'lucide-react';
import { demoNotchClipboard, demoPicture } from '../config/demo';

export type NotchWidgetId = 'clock' | 'media' | 'system' | 'power' | 'clipboard' | 'explorer';
export type NotchSurface = 'glance' | 'board';

export interface NotchWidgetContext {
  now: Date;
  track: { title: string; artist: string; art: string };
  playing: boolean;
  cpu: number;
  memory: number;
  gpu: number;
  keepAwake: boolean;
  onPlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onPower: () => void;
  onFiles: () => void;
  onClipboard: (text: string) => void;
  onTaskManager: () => void;
}

interface Props {
  id: NotchWidgetId;
  surface: NotchSurface;
  ctx: NotchWidgetContext;
}

const MEMORY_TOTAL_GB = 31.1;
const time = (d: Date) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
const weekday = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'long' });
const longDate = (d: Date) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'long' });
const pct = (n: number) => `${Math.round(n)}%`;

function Btn({ big, label, onClick, children }: { big?: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={`alc-nw-btn${big ? ' is-lg' : ''}`}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

function Art({ ctx, px, icon }: { ctx: NotchWidgetContext; px: number; icon: number }) {
  const src = demoPicture(ctx.track.art);
  return (
    <span className="alc-nw-art" style={{ width: px, height: px }}>
      {src ? <img src={src} alt="" draggable={false} /> : <Music size={icon} />}
    </span>
  );
}

function Controls({ ctx, previous }: { ctx: NotchWidgetContext; previous: boolean }) {
  return (
    <span className="alc-nw-controls">
      {previous && (
        <Btn big label="Previous track" onClick={ctx.onPrevious}>
          <SkipBack size={16} />
        </Btn>
      )}
      <Btn big label={ctx.playing ? 'Pause' : 'Play'} onClick={ctx.onPlay}>
        {ctx.playing ? <Pause size={16} /> : <Play size={16} />}
      </Btn>
      <Btn big label="Next track" onClick={ctx.onNext}>
        <SkipForward size={16} />
      </Btn>
    </span>
  );
}

function Meter({ label, value, detail }: { label: string; value: number; detail?: string }) {
  return (
    <div className="alc-nw-meter">
      <div className="alc-nw-meter-head">
        <span className="alc-nw-secondary">{label}</span>
        <span className="alc-nw-strong alc-nw-medium alc-nw-num">{pct(value)}</span>
      </div>
      <span className="alc-nw-bar">
        <span style={{ width: `${Math.min(100, value)}%` }} />
      </span>
      {detail && <span className="alc-nw-2xs alc-nw-muted alc-nw-num">{detail}</span>}
    </div>
  );
}

export default function DemoNotchWidget({ id, surface, ctx }: Props) {
  switch (id) {
    case 'clock':
      return (
        <div className="alc-nw alc-nw-col alc-nw-center-y alc-nw-clock" data-notch-widget="clock">
          <span className="alc-nw-clock-big">{time(ctx.now)}</span>
          <span className="alc-nw-xs alc-nw-secondary alc-nw-truncate">
            {weekday(ctx.now)}, {longDate(ctx.now)}
          </span>
        </div>
      );

    case 'media':
      if (surface === 'glance') {
        return (
          <div className="alc-nw-glance-media" data-notch-media>
            <Art ctx={ctx} px={40} icon={18} />
            <span className="alc-nw-media-text alc-nw-gap-05">
              <span className="alc-nw-sm alc-nw-medium alc-nw-strong alc-nw-truncate">{ctx.track.title}</span>
              <span className="alc-nw-xs alc-nw-secondary alc-nw-truncate">{ctx.track.artist}</span>
            </span>
            <Controls ctx={ctx} previous={false} />
          </div>
        );
      }
      return (
        <div className="alc-nw alc-nw-row alc-nw-media-wide" data-notch-widget="media">
          <Art ctx={ctx} px={144} icon={32} />
          <div className="alc-nw-media-text">
            <span className="alc-nw-source">Spotify</span>
            <span className="alc-nw-title">{ctx.track.title}</span>
            <span className="alc-nw-sm alc-nw-secondary alc-nw-truncate">{ctx.track.artist}</span>
            <span className="alc-nw-media-foot">
              <Controls ctx={ctx} previous />
            </span>
          </div>
        </div>
      );

    case 'system':
      return (
        <div className="alc-nw alc-nw-col alc-nw-gap-25" data-notch-widget="system">
          <div className="alc-nw-head is-tight">
            <span className="alc-nw-xs alc-nw-medium alc-nw-strong">System</span>
            <Btn label="Open Task Manager" onClick={ctx.onTaskManager}>
              <SquareArrowOutUpRight size={13} />
            </Btn>
          </div>
          <Meter label="CPU" value={ctx.cpu} />
          <Meter label="Memory" value={ctx.memory} detail={`${((ctx.memory / 100) * MEMORY_TOTAL_GB).toFixed(1)} / ${MEMORY_TOTAL_GB} GB`} />
          <Meter label="GPU" value={ctx.gpu} />
        </div>
      );

    case 'power':
      return (
        <button
          type="button"
          className="alc-nw alc-nw-col alc-nw-center-y alc-nw-tilebtn alc-nw-gap-15"
          aria-label="Power options"
          title="Power options"
          onClick={(e) => {
            e.stopPropagation();
            ctx.onPower();
          }}
          data-notch-widget="power"
        >
          <span className={`alc-nw-badge${ctx.keepAwake ? ' is-on' : ''}`}>
            {ctx.keepAwake ? <Coffee size={15} /> : <Power size={15} />}
          </span>
          <span className="alc-nw-stack">
            <span className="alc-nw-xs alc-nw-medium alc-nw-strong">Power</span>
            {ctx.keepAwake && <span className="alc-nw-2xs alc-nw-muted">Keeping awake</span>}
          </span>
        </button>
      );

    case 'clipboard':
      return (
        <div className="alc-nw alc-nw-col alc-nw-gap-1" data-notch-widget="clipboard">
          <span className="alc-nw-xs alc-nw-medium alc-nw-strong">Clipboard</span>
          <div className="alc-nw-list">
            {demoNotchClipboard.map((entry) => (
              <button
                key={entry.text}
                type="button"
                className={`alc-nw-list-row${entry.image ? ' is-other' : ''}`}
                title={`Copy ${entry.text}`}
                onClick={(e) => {
                  e.stopPropagation();
                  ctx.onClipboard(entry.text);
                }}
              >
                {entry.image && <Image size={12} className="alc-nw-muted" />}
                <span className="alc-nw-truncate alc-nw-grow">{entry.text}</span>
                <span className="alc-nw-2xs alc-nw-muted">{entry.ago}</span>
              </button>
            ))}
          </div>
        </div>
      );

    case 'explorer':
      return (
        <button
          type="button"
          className="alc-nw alc-nw-col alc-nw-center-y alc-nw-tilebtn alc-nw-gap-15"
          aria-label="Open Alcove Files"
          title="Open Alcove Files"
          onClick={(e) => {
            e.stopPropagation();
            ctx.onFiles();
          }}
          data-notch-widget="explorer"
        >
          <span className="alc-nw-badge">
            <FolderOpen size={15} />
          </span>
          <span className="alc-nw-xs alc-nw-medium alc-nw-strong">Files</span>
        </button>
      );
  }
}
