import { X } from 'lucide-react';
import DemoPeekContent from './DemoPeekContent';
import type { DemoFile } from '../config/demo';

interface Props {
  file: DemoFile;
  themeClass: string;
  onClose: () => void;
}

export default function DemoPeek({ file, themeClass, onClose }: Props) {
  return (
    <aside className={`ad-app ${themeClass} ad-peek`} aria-label={`Peek: ${file.label}`}>
      <header className="ad-peek-head">
        <span>{file.label}</span>
        <button type="button" className="ad-xs-btn" onClick={onClose} aria-label="Close Peek">
          <X size={12} />
        </button>
      </header>
      <div className="ad-peek-body">
        <DemoPeekContent item={file} />
      </div>
      <footer className="ad-peek-foot">{file.path}</footer>
    </aside>
  );
}
