import { demoIcon } from '../config/demo';
import type { DemoEntry } from '../config/demo';

interface Props {
  entries: DemoEntry[];
  focused: string | null;
  onFocus: (name: string) => void;
  onOpen: (entry: DemoEntry) => void;
}

const stripExt = (name: string) => name.replace(/\.[^/.]+$/, '');

function formatSize(bytes: number) {
  if (bytes === 0) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export default function DemoFileList({ entries, focused, onFocus, onOpen }: Props) {
  return (
    <div className="alc-list">
      {entries.map((e) => (
        <button
          key={e.name}
          type="button"
          className="alc-row"
          data-name={e.name}
          data-focused={focused === e.name || undefined}
          title={e.name}
          onFocus={() => onFocus(e.name)}
          onClick={() => onOpen(e)}
        >
          <span className="alc-row-icon">
            {e.entries ? (
              <span aria-hidden="true">📁</span>
            ) : e.name.endsWith('.txt') ? (
              <img src={demoIcon('text-file')} alt="" width={24} height={24} draggable={false} />
            ) : (
              <span aria-hidden="true">📄</span>
            )}
          </span>
          <span className="alc-row-name">{stripExt(e.name)}</span>
          <span className="alc-row-meta alc-col-size">{formatSize(e.size)}</span>
          <span className="alc-row-meta alc-col-created">{formatDate(e.created)}</span>
          <span className="alc-row-meta alc-col-modified">{formatDate(e.modified)}</span>
        </button>
      ))}
    </div>
  );
}
