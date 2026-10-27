import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Palette, Search, ShelvingUnit, Trash2 } from 'lucide-react';
import DemoPeekContent from './DemoPeekContent';
import { demoIcon } from '../config/demo';
import type { DemoItem } from '../config/demo';
import { THEMES } from '../config/themes';

export type ShelfEntry =
  | { kind: 'item'; key: string; item: DemoItem; where: string }
  | { kind: 'theme'; key: string; id: string; label: string };

interface Props {
  items: { item: DemoItem; where: string }[];
  themeClass: string;
  onOpen: (entry: ShelfEntry) => void;
  onClose: () => void;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const i = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

export default function DemoShelf({ items, themeClass, onOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const q = query.trim();
  const themeQuery = /^theme:?\s*/i.test(q) ? q.replace(/^theme:?\s*/i, '') : null;

  const results = useMemo<ShelfEntry[]>(() => {
    if (themeQuery !== null) {
      return THEMES.filter((t) => t.name.toLowerCase().includes(themeQuery.toLowerCase())).map((t) => ({
        kind: 'theme',
        key: `theme-${t.id}`,
        id: t.id,
        label: `Theme: ${t.name}`,
      }));
    }
    const list = q ? items.filter((e) => e.item.label.toLowerCase().includes(q.toLowerCase())) : items;
    return list.map((e) => ({ kind: 'item', key: e.item.id, item: e.item, where: e.where }));
  }, [items, q, themeQuery]);

  useEffect(() => input.current?.focus(), []);
  useEffect(() => setActive(0), [query]);

  const current = results[active];
  const highlight = themeQuery ?? q;

  return (
    <div className={`alc-app ${themeClass} alc-shelf`} role="dialog" aria-label="Shelf">
      <span className="alc-shelf-pill" aria-hidden="true" />
      <div className="alc-shelf-head">
        <GripVertical size={14} className="alc-shelf-grip" aria-hidden="true" />
        <span className="alc-shelf-lockup">
          <ShelvingUnit size={18} strokeWidth={2.5} aria-hidden="true" />
          Shelf
        </span>
        <label className="alc-shelf-field" data-active={q ? true : undefined}>
          <span className="alc-shelf-mode">
            Local <ChevronDown size={12} aria-hidden="true" />
          </span>
          <span className="alc-shelf-divider" />
          <Search size={18} className="alc-shelf-search-icon" aria-hidden="true" />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((i) => Math.min(results.length - 1, i + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((i) => Math.max(0, i - 1));
              } else if (e.key === 'Enter' && current) {
                onOpen(current);
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
            placeholder="Search shortcuts, apps, files and commands..."
            aria-label="Search the Shelf"
            aria-controls="alc-shelf-results"
            aria-activedescendant={current ? `alc-shelf-${current.key}` : undefined}
          />
          {q && <span className="alc-shelf-count">{results.length} {results.length === 1 ? 'result' : 'results'}</span>}
        </label>
        <button type="button" className="alc-shelf-toggle" onClick={onClose}>
          Toggle window
          <kbd>[Ctrl+Shift+Space]</kbd>
        </button>
      </div>
      <div className="alc-shelf-main">
        <div className="alc-shelf-list">
          <div className="alc-shelf-section">
            <span>{q ? 'Results' : 'Recents'}</span>
            {!q && (
              <span className="alc-shelf-clear">
                <Trash2 size={11} aria-hidden="true" /> Clear recents
              </span>
            )}
          </div>
          <ul id="alc-shelf-results" role="listbox" aria-label="Results">
            {results.map((e, i) => (
              <li
                key={e.key}
                id={`alc-shelf-${e.key}`}
                role="option"
                aria-selected={i === active}
                className="alc-shelf-row"
                onMouseMove={() => setActive(i)}
                onClick={() => onOpen(e)}
              >
                <span className="alc-shelf-row-icon">
                  {e.kind === 'theme' ? (
                    <Palette size={16} />
                  ) : e.item.kind === 'folder' ? (
                    <span aria-hidden="true">📁</span>
                  ) : (
                    <img src={demoIcon(e.item.icon)} alt="" width={20} height={20} />
                  )}
                </span>
                <span className="alc-shelf-row-text">
                  <span className="alc-shelf-row-name">
                    <Highlight text={e.kind === 'theme' ? e.label : e.item.label} query={highlight} />
                  </span>
                  <span className="alc-shelf-row-detail">{e.kind === 'theme' ? 'Command' : e.item.recent}</span>
                </span>
                {i === active && <ChevronRight size={14} className="alc-shelf-row-chev" aria-hidden="true" />}
              </li>
            ))}
          </ul>
          {results.length === 0 && <p className="alc-shelf-empty">Nothing called that. Try "calc" or "theme".</p>}
        </div>
        <aside className="alc-shelf-preview" aria-live="polite">
          <div className="alc-shelf-preview-head">
            <span>Preview</span>
            {current?.kind === 'item' && current.item.kind === 'file' && <span>{current.item.size}</span>}
          </div>
          <div className="alc-shelf-preview-body">
            {current?.kind === 'item' && <DemoPeekContent item={current.item} />}
            {current?.kind === 'theme' && (
              <p className="alc-shelf-preview-note">Press Enter to switch. The site switches with it.</p>
            )}
          </div>
        </aside>
      </div>
      <footer className="alc-shelf-foot">
        <span>
          <kbd>[Enter]</kbd> Open <kbd>[Tab]</kbd> or <kbd>[Right]</kbd> Menu
        </span>
        <span className="alc-shelf-foot-hint">
          Search for <kbd>Theme:</kbd> in the Shelf to switch themes
        </span>
        <span className="alc-shelf-foot-end">
          <kbd>[Esc]</kbd> Close
        </span>
      </footer>
    </div>
  );
}
