import { demoIcon, demoPicture } from '../config/demo';
import type { DemoEntry } from '../config/demo';

interface Props {
  entries: DemoEntry[];
  tile: number;
  focused: string | null;
  onFocus: (name: string) => void;
  onOpen: (entry: DemoEntry) => void;
}

const stripExt = (name: string) => name.replace(/\.[^/.]+$/, '');

export default function DemoEntryGrid({ entries, tile, focused, onFocus, onOpen }: Props) {
  const iconSize = Math.round(tile * 0.45);
  return (
    <div className="alc-entry-grid" style={{ gridTemplateColumns: `repeat(auto-fill, ${tile}px)`, gridAutoRows: tile }}>
      {entries.map((e) => (
        <button
          key={e.name}
          type="button"
          className="alc-tile alc-entry-tile"
          data-name={e.name}
          data-focused={focused === e.name || undefined}
          title={e.name}
          style={{ fontSize: Math.round(tile * 0.14) }}
          onFocus={() => onFocus(e.name)}
          onClick={() => onOpen(e)}
        >
          <span className="alc-tile-icon" style={{ width: iconSize, height: iconSize, fontSize: iconSize * 0.8 }}>
            {e.entries ? (
              <span aria-hidden="true">📁</span>
            ) : e.picture ? (
              <img className="alc-thumb" src={demoPicture(e.picture)} alt="" width={iconSize} height={iconSize} draggable={false} />
            ) : e.name.endsWith('.txt') ? (
              <img src={demoIcon('text-file')} alt="" width={iconSize} height={iconSize} draggable={false} />
            ) : (
              <span aria-hidden="true">📄</span>
            )}
          </span>
          <span className="alc-tile-label">{stripExt(e.name)}</span>
        </button>
      ))}
    </div>
  );
}
