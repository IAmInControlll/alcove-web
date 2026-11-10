import { LayoutGrid, List } from 'lucide-react';

export type LinkedView = 'list' | 'grid';

interface Props {
  view: LinkedView;
  onView: (view: LinkedView) => void;
}

export default function DemoLinkedViewToggle({ view, onView }: Props) {
  return (
    <div className="alc-view-toggle" role="group" aria-label="Linked folder view">
      <button type="button" className="alc-sm-btn" aria-label="List" title="List" aria-pressed={view === 'list'} onClick={() => onView('list')}>
        <List size={14} />
      </button>
      <button type="button" className="alc-sm-btn" aria-label="Grid" title="Grid" aria-pressed={view === 'grid'} onClick={() => onView('grid')}>
        <LayoutGrid size={14} />
      </button>
    </div>
  );
}
