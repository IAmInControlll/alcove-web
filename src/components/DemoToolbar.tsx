import { forwardRef } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Headphones,
  Lock,
  Moon,
  Power,
  RotateCw,
  Search,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import DemoCrumbs from './DemoCrumbs';
import DemoLinkedViewToggle from './DemoLinkedViewToggle';
import type { LinkedView } from './DemoLinkedViewToggle';

interface Props {
  crumbs: string[];
  query: string;
  muted: boolean;
  volume: number;
  audioOpen: boolean;
  powerOpen: boolean;
  keepAwake: boolean;
  linkedView: LinkedView | null;
  onCrumb: (index: number) => void;
  onQuery: (q: string) => void;
  onMute: () => void;
  onVolume: (v: number) => void;
  onToggleAudio: () => void;
  onTogglePower: () => void;
  onPower: () => void;
  onOutput: () => void;
  onMixer: () => void;
  onKeepAwake: () => void;
  onSystem: () => void;
  onLinkedView: (view: LinkedView) => void;
}

const DemoToolbar = forwardRef<HTMLInputElement, Props>(function DemoToolbar(
  {
    crumbs,
    query,
    muted,
    volume,
    audioOpen,
    powerOpen,
    keepAwake,
    linkedView,
    onCrumb,
    onQuery,
    onMute,
    onVolume,
    onToggleAudio,
    onTogglePower,
    onPower,
    onOutput,
    onMixer,
    onKeepAwake,
    onSystem,
    onLinkedView,
  },
  searchRef,
) {
  return (
    <div className="alc-toolbar">
      <DemoCrumbs crumbs={crumbs} onCrumb={onCrumb} />
      {linkedView && <DemoLinkedViewToggle view={linkedView} onView={onLinkedView} />}
      <span className="alc-spacer" />
      <div className="alc-group alc-group-audio">
        <button type="button" className="alc-sm-btn" data-danger={muted || undefined} aria-label={muted ? 'Unmute' : 'Mute'} onClick={onMute}>
          {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
        {audioOpen && (
          <>
            <input
              type="range"
              className="alc-slider"
              min={0}
              max={100}
              value={muted ? 0 : volume}
              onChange={(e) => onVolume(Number(e.target.value))}
              aria-label="Volume"
              style={{ '--fill': `${muted ? 0 : volume}%` } as React.CSSProperties}
            />
            <span className="alc-vol">{muted ? 0 : volume}%</span>
            <span className="alc-divider" />
            <button type="button" className="alc-sm-btn" aria-label="Audio devices" title="Audio devices" onClick={onOutput}>
              <Headphones size={13} />
            </button>
            <span className="alc-divider" />
            <button type="button" className="alc-sm-btn" aria-label="App volume mixer" title="App volume mixer" onClick={onMixer}>
              <SlidersHorizontal size={13} />
            </button>
          </>
        )}
        <span className="alc-divider" />
        <button type="button" className="alc-sm-btn alc-group-toggle" aria-label={audioOpen ? 'Collapse' : 'Expand'} onClick={onToggleAudio}>
          {audioOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
        </button>
      </div>
      <div className="alc-group alc-group-power">
        <button type="button" className="alc-sm-btn" aria-label="Shut down" title="Shut down" onClick={onPower}>
          <Power size={13} />
        </button>
        {(powerOpen || keepAwake) && (
          <>
            <span className="alc-divider" />
            <button
              type="button"
              className="alc-sm-btn"
              data-on={keepAwake || undefined}
              aria-label={keepAwake ? 'Keep awake: on' : 'Keep awake: off'}
              title={keepAwake ? 'Keep awake: on' : 'Keep awake: off'}
              aria-pressed={keepAwake}
              onClick={onKeepAwake}
            >
              <Coffee size={13} />
            </button>
          </>
        )}
        {powerOpen && (
          <>
            <span className="alc-divider" />
            <button type="button" className="alc-sm-btn" aria-label="Restart" title="Restart" onClick={onPower}>
              <RotateCw size={13} />
            </button>
            <span className="alc-divider" />
            <button type="button" className="alc-sm-btn" aria-label="Sleep" title="Sleep" onClick={onPower}>
              <Moon size={13} />
            </button>
            <span className="alc-divider" />
            <button type="button" className="alc-sm-btn" aria-label="Lock" title="Lock" onClick={onPower}>
              <Lock size={13} />
            </button>
          </>
        )}
        <span className="alc-divider" />
        <button type="button" className="alc-sm-btn alc-group-toggle" aria-label={powerOpen ? 'Collapse' : 'Expand'} onClick={onTogglePower}>
          {powerOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
        </button>
      </div>
      <button type="button" className="alc-sm-btn" aria-label="System info and Task Manager" title="System info and Task Manager" onClick={onSystem}>
        <Activity size={13} />
      </button>
      <label className="alc-search">
        <Search size={12} aria-hidden="true" />
        <input ref={searchRef} value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search..." aria-label="Search the grid" />
        {query ? (
          <button type="button" className="alc-search-clear" aria-label="Clear search" onClick={() => onQuery('')}>
            <X size={12} />
          </button>
        ) : (
          <kbd>Ctrl+F</kbd>
        )}
      </label>
    </div>
  );
});

export default DemoToolbar;
