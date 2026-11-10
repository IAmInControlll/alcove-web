import { ChevronDown, ChevronRight, Minus, PanelTopOpen, Settings, ShelvingUnit, X } from 'lucide-react';
import DemoLockup from './DemoLockup';

interface Props {
  hint: string;
  hintVisible: boolean;
  menuOpen: boolean;
  toolbarVisible: boolean;
  onShelf: () => void;
  onNotch: () => void;
  onSettings: () => void;
  onHide: () => void;
  onToggleToolbar: () => void;
  children?: React.ReactNode;
}

export default function DemoTitleBar({ hint, hintVisible, menuOpen, toolbarVisible, onShelf, onNotch, onSettings, onHide, onToggleToolbar, children }: Props) {
  return (
    <header className="alc-titlebar">
      <DemoLockup />
      <div className="alc-titlebar-tools">
        <button type="button" className="alc-tb-btn" aria-label="Shelf" title="Shelf" onClick={onShelf}>
          <ShelvingUnit size={14} />
        </button>
        <button type="button" className="alc-tb-btn alc-notch-toggle" aria-label="Notch" title="Notch" onClick={onNotch}>
          <PanelTopOpen size={14} />
        </button>
        <span className="alc-anchor">
          <button
            type="button"
            className="alc-tb-btn alc-menu-toggle"
            aria-label="Settings"
            title="Settings"
            aria-expanded={menuOpen}
            onClick={onSettings}
          >
            <Settings size={14} />
          </button>
          {children}
        </span>
        <button
          type="button"
          className="alc-tb-btn"
          aria-label={toolbarVisible ? 'Hide toolbar' : 'Show toolbar'}
          title={toolbarVisible ? 'Hide toolbar' : 'Show toolbar'}
          onClick={onToggleToolbar}
        >
          {toolbarVisible ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>
      <div className="alc-titlebar-centre">
        <span className="alc-grab" aria-hidden="true" />
        <span className="alc-hint" data-visible={hintVisible || undefined} aria-live="polite">
          {hint}
        </span>
      </div>
      <button type="button" className="alc-hotkey" onClick={onHide} aria-label="Hide Alcove (Ctrl+Space)">
        <kbd>[Ctrl+Space]</kbd>
      </button>
      <button type="button" className="alc-tb-btn alc-tb-caption" aria-label="Minimize" title="Minimize" onClick={onHide}>
        <Minus size={14} />
      </button>
      <button type="button" className="alc-tb-btn alc-tb-caption alc-tb-close" aria-label="Close" title="Close" onClick={onHide}>
        <X size={14} />
      </button>
    </header>
  );
}
