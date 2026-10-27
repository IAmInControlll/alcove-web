import { ChevronDown, Minus, Settings, ShelvingUnit, X } from 'lucide-react';
import DemoLockup from './DemoLockup';

interface Props {
  hint: string;
  hintVisible: boolean;
  menuOpen: boolean;
  onShelf: () => void;
  onSettings: () => void;
  onHide: () => void;
  children?: React.ReactNode;
}

export default function DemoTitleBar({ hint, hintVisible, menuOpen, onShelf, onSettings, onHide, children }: Props) {
  return (
    <header className="alc-titlebar">
      <DemoLockup />
      <div className="alc-titlebar-tools">
        <button type="button" className="alc-tb-btn" aria-label="Open the Shelf" onClick={onShelf}>
          <ShelvingUnit size={14} />
        </button>
        <span className="alc-anchor">
          <button
            type="button"
            className="alc-tb-btn"
            aria-label="Themes"
            aria-expanded={menuOpen}
            onClick={onSettings}
          >
            <Settings size={14} />
          </button>
          {children}
        </span>
        <button type="button" className="alc-tb-btn" aria-label="Toolbar" tabIndex={-1}>
          <ChevronDown size={14} />
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
      <button type="button" className="alc-tb-btn alc-tb-caption" aria-label="Minimise" onClick={onHide}>
        <Minus size={14} />
      </button>
      <button type="button" className="alc-tb-btn alc-tb-caption alc-tb-close" aria-label="Close" onClick={onHide}>
        <X size={14} />
      </button>
    </header>
  );
}
