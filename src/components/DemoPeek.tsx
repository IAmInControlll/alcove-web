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
    <aside className={`alc-app ${themeClass} alc-peek`} aria-label={`Peek: ${file.label}`}>
      <header className="alc-peek-head">
        <span>{file.label}</span>
        <button type="button" className="alc-xs-btn" onClick={onClose} aria-label="Close Peek">
          <X size={12} />
        </button>
      </header>
      <div className="alc-peek-body">
        <DemoPeekContent item={file} />
      </div>
      <footer className="alc-peek-foot">{file.path}</footer>
    </aside>
  );
}
