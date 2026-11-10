import { Pencil, Search, Settings, ShelvingUnit } from 'lucide-react';
import AlcoveGlyph from './AlcoveGlyph';

interface Props {
  query: string;
  /** A picture of the footer, as the homepage card draws it: nothing reacts. */
  still?: boolean;
  /** Edit layout and Notch settings, which the homepage card leaves out to fit. */
  layoutTools?: boolean;
  onQuery?: (query: string) => void;
  onSubmit?: () => void;
  onAlcove?: () => void;
  onShelf?: () => void;
  onEdit?: () => void;
  onSettings?: () => void;
}

/** Stage 2's footer: the search box that narrows the pins on show, Open
 *  Alcove and Open the Shelf beside it, then Edit layout and Notch settings. */
export default function DemoNotchFooter({ layoutTools = true, ...p }: Props) {
  const tab = p.still ? -1 : undefined;
  return (
    <div className="alc-notch-footer">
      <label className="alc-search alc-notch-search">
        <Search size={12} aria-hidden="true" />
        <input
          value={p.query}
          readOnly={p.still}
          tabIndex={tab}
          onChange={(e) => p.onQuery?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && p.query) {
              e.preventDefault();
              e.stopPropagation();
              p.onQuery?.('');
            } else if (e.key === 'Enter') {
              e.preventDefault();
              p.onSubmit?.();
            }
          }}
          placeholder="Search..."
          aria-label="Search the Notch"
          spellCheck={false}
          autoComplete="off"
        />
      </label>
      <button type="button" className="alc-nw-btn is-lg" tabIndex={tab} aria-label="Open Alcove" title="Open Alcove" onClick={p.onAlcove}>
        <AlcoveGlyph mono size={15} />
      </button>
      <button type="button" className="alc-nw-btn is-lg" tabIndex={tab} aria-label="Open the Shelf" title="Open the Shelf" onClick={p.onShelf}>
        <ShelvingUnit size={15} />
      </button>
      {layoutTools && (
        <>
          <span className="alc-notch-spacer" />
          <button type="button" className="alc-nw-btn is-lg" tabIndex={tab} aria-label="Edit widget layout" title="Edit widget layout" onClick={p.onEdit}>
            <Pencil size={15} />
          </button>
          <button type="button" className="alc-nw-btn is-lg" tabIndex={tab} aria-label="Notch settings" title="Notch settings" onClick={p.onSettings}>
            <Settings size={15} />
          </button>
        </>
      )}
    </div>
  );
}
