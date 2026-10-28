import { demoIcon, folderSwatch } from '../config/demo';
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
          ['Type', item.link ? 'Linked folder' : 'Folder'],
          ['Items', String(item.link ? item.link.entries.length : item.items.length)],
          ...(item.link ? [['Target', item.link.path]] : []),
        ]
      : [
          ['Type', item.type],
          ['Target', item.target],
        ];
  return (
    <div className="alc-peek-info">
      {item.kind === 'folder' ? (
        <span className="alc-folder alc-folder-lg" style={folderSwatch(item.color)}>
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
