import { demoIcon } from '../config/demo';
import type { DemoItem } from '../config/demo';

interface Props {
  item: DemoItem;
}

export default function DemoPeekContent({ item }: Props) {
  if (item.kind === 'file') {
    return <pre className="alc-peek-text">{item.body}</pre>;
  }
  const rows =
    item.kind === 'folder'
      ? [
          ['Type', 'Folder'],
          ['Items', String(item.items.length)],
        ]
      : [
          ['Type', item.type],
          ['Target', item.target],
        ];
  return (
    <div className="alc-peek-info">
      {item.kind === 'folder' ? (
        <span className="alc-folder alc-folder-lg" style={{ background: `${item.color}33`, border: `1px solid ${item.color}66` }}>
          <span aria-hidden="true">📁</span>
        </span>
      ) : (
        <span className="alc-peek-app-icon">
          <img src={demoIcon(item.icon)} alt="" width={32} height={32} />
        </span>
      )}
      <p className="alc-peek-name">{item.label}</p>
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
