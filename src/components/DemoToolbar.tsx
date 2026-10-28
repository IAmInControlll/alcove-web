import { forwardRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
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

interface Props {
  crumbs: string[];
  query: string;
  muted: boolean;
  volume: number;
  audioOpen: boolean;
  powerOpen: boolean;
  onCrumb: (index: number) => void;
  onQuery: (q: string) => void;
  onMute: () => void;
  onVolume: (v: number) => void;
  onToggleAudio: () => void;
  onTogglePower: () => void;
  onPower: () => void;
  onOutput: () => void;
  onMixer: () => void;
}

const DemoToolbar = forwardRef<HTMLInputElement, Props>(function DemoToolbar(
  { crumbs, query, muted, volume, audioOpen, powerOpen, onCrumb, onQuery, onMute, onVolume, onToggleAudio, onTogglePower, onPower, onOutput, onMixer },
  searchRef,
) {
  return (
    <div className="alc-toolbar">
      <DemoCrumbs crumbs={crumbs} onCrumb={onCrumb} />
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
            <button type="button" className="alc-sm-btn" aria-label="Output device" onClick={onOutput}>
              <Headphones size={13} />
            </button>
            <button type="button" className="alc-sm-btn" aria-label="Mixer" onClick={onMixer}>
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
        <button type="button" className="alc-sm-btn" aria-label="Shut down" onClick={onPower}>
          <Power size={13} />
        </button>
        {powerOpen && (
          <>
            <button type="button" className="alc-sm-btn" aria-label="Restart" onClick={onPower}>
              <RotateCw size={13} />
            </button>
            <button type="button" className="alc-sm-btn" aria-label="Sleep" onClick={onPower}>
              <Moon size={13} />
            </button>
            <button type="button" className="alc-sm-btn" aria-label="Lock" onClick={onPower}>
              <Lock size={13} />
            </button>
          </>
        )}
        <span className="alc-divider" />
        <button type="button" className="alc-sm-btn alc-group-toggle" aria-label={powerOpen ? 'Collapse' : 'Expand'} onClick={onTogglePower}>
          {powerOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
        </button>
      </div>
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
