import { FileText, Folder } from 'lucide-react';
import { demoPicture } from '../config/demo';
import type { DemoEntry } from '../config/demo';

interface Props {
  entry: DemoEntry;
}

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico'];
const TEXT_EXTS = [
  'txt', 'md', 'json', 'xml', 'csv', 'js', 'ts', 'tsx', 'jsx', 'py', 'rs', 'go', 'java', 'c',
  'cpp', 'h', 'hpp', 'html', 'htm', 'css', 'yaml', 'yml', 'toml', 'ini', 'sh', 'bat', 'ps1', 'url',
];
const PROSE_EXTS = ['txt', 'md', 'markdown'];

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function DemoEntryPeek({ entry }: Props) {
  const ext = entry.name.includes('.') ? entry.name.split('.').pop()!.toLowerCase() : '';

  if (!entry.entries && IMAGE_EXTS.includes(ext) && entry.picture) {
    return (
      <div className="alc-peek-image">
        <img src={demoPicture(entry.picture)} alt={entry.name} />
      </div>
    );
  }

  if (!entry.entries && ext === 'pdf' && entry.body) {
    const [heading, ...lines] = entry.body.split('\n');
    return (
      <div className="alc-peek-pdf">
        <div className="alc-peek-page">
          <h4>{heading}</h4>
          {lines.map((line, i) => (line ? <p key={i}>{line}</p> : <br key={i} />))}
        </div>
      </div>
    );
  }

  if (!entry.entries && TEXT_EXTS.includes(ext) && entry.body) {
    return (
      <pre className="alc-peek-text" data-code={PROSE_EXTS.includes(ext) ? undefined : ''}>
        {entry.body}
      </pre>
    );
  }

  const rows = entry.entries
    ? [
        ['Type', 'Folder'],
        ['Contents', `${entry.entries.length} items`],
      ]
    : [
        ['Type', (ext || 'file').toUpperCase()],
        ['Size', formatSize(entry.size)],
      ];

  return (
    <div className="alc-peek-info">
      <span className="alc-peek-glyph">{entry.entries ? <Folder size={48} /> : <FileText size={48} />}</span>
      <p className="alc-peek-name">{entry.name}</p>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
