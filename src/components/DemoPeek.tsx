import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  path: string;
  themeClass: string;
  onClose: () => void;
  children: ReactNode;
}

export default function DemoPeek({ title, path, themeClass, onClose, children }: Props) {
  return (
    <aside className={`alc-app ${themeClass} alc-peek`} aria-label={`Peek: ${title}`}>
      <header className="alc-peek-head">
        <span>{title}</span>
        <button type="button" className="alc-xs-btn" onClick={onClose} aria-label="Close Peek">
          <X size={12} />
        </button>
      </header>
      <div className="alc-peek-body">{children}</div>
      <footer className="alc-peek-foot">{path}</footer>
    </aside>
  );
}
