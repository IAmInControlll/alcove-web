import { Archive, FileJson, Folder, HardDrive, WifiOff } from 'lucide-react';

interface Entry {
  name: string;
  kind: 'folder' | 'file';
  holds: string;
}

const entries: Entry[] = [
  { name: 'shortcuts', kind: 'folder', holds: 'Copies of your shortcuts' },
  { name: 'icons', kind: 'folder', holds: 'Cached icons' },
  { name: 'settings.json', kind: 'file', holds: 'Theme and hotkeys' },
  { name: 'positions.json', kind: 'file', holds: 'Where each tile sits' },
  { name: 'folder_colors.json', kind: 'file', holds: 'Folder colours' },
];

export default function DataFolderVisual() {
  return (
    <div className="data-win" aria-label="The Alcove data folder and what is in it">
      <div className="data-win-bar">
        <HardDrive size={15} aria-hidden="true" />
        <span className="data-win-path">%APPDATA%\Alcove\</span>
        <span className="data-win-badge">Stays on this PC</span>
      </div>
      <ul className="data-win-list">
        {entries.map((e) => (
          <li key={e.name}>
            {e.kind === 'folder' ? (
              <Folder size={16} className="data-win-folder" aria-hidden="true" />
            ) : (
              <FileJson size={16} aria-hidden="true" />
            )}
            <span className="data-win-name">
              {e.name}
              {e.kind === 'folder' && '\\'}
            </span>
            <span className="data-win-holds">{e.holds}</span>
          </li>
        ))}
      </ul>
      <p className="data-win-foot">
        <Archive size={15} aria-hidden="true" />
        Backs up to one <code>.alcove-backup</code> file
      </p>
      <p className="data-win-offline">
        <WifiOff size={15} aria-hidden="true" />
        Works offline
      </p>
    </div>
  );
}
