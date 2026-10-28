export type SortColumn = 'name' | 'size' | 'created' | 'modified';
export type SortDir = 'asc' | 'desc';

const COLUMNS: { key: SortColumn; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'size', label: 'Size' },
  { key: 'created', label: 'Created' },
  { key: 'modified', label: 'Modified' },
];

interface Props {
  column: SortColumn;
  dir: SortDir;
  onSort: (column: SortColumn) => void;
}

export default function DemoColumnHeaders({ column, dir, onSort }: Props) {
  return (
    <div className="alc-cols">
      <span className="alc-col-icon" />
      {COLUMNS.map((c) => (
        <button key={c.key} type="button" className={`alc-col alc-col-${c.key}`} onClick={() => onSort(c.key)}>
          {c.label}
          {column === c.key && <span aria-hidden="true">{dir === 'asc' ? '▲' : '▼'}</span>}
        </button>
      ))}
    </div>
  );
}
