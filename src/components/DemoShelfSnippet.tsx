import { ChevronDown, Coffee, FileSpreadsheet, FileText, GripVertical, Monitor, Search, ShelvingUnit, Sigma, Volume2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Highlight } from './DemoShelf';
import { demoIcon } from '../config/demo';
import type { ShelfSnippet, ShelfSnippetRow, ShelfSymbol } from '../config/home';

const SYMBOLS: Record<Exclude<ShelfSymbol, 'folder'>, LucideIcon> = {
  sheet: FileSpreadsheet,
  file: FileText,
  coffee: Coffee,
  volume: Volume2,
  monitor: Monitor,
  sigma: Sigma,
};

function RowIcon({ icon }: { icon: ShelfSnippetRow['icon'] }) {
  if ('app' in icon) return <img src={demoIcon(icon.app)} alt="" width={20} height={20} />;
  if (icon.symbol === 'folder') return <span aria-hidden="true">📁</span>;
  const Icon = SYMBOLS[icon.symbol];
  return <Icon size={16} />;
}

interface Props {
  snippet: ShelfSnippet;
  themeClass: string;
}

export default function DemoShelfSnippet({ snippet, themeClass }: Props) {
  let first = true;
  return (
    <div className={`alc-app ${themeClass} alc-snippet`} aria-hidden="true" data-follow-theme>
      <div className="alc-shelf-head">
        <GripVertical size={14} className="alc-shelf-grip" />
        <span className="alc-shelf-lockup">
          <ShelvingUnit size={18} strokeWidth={2.5} />
          Shelf
        </span>
        <div className="alc-shelf-field" data-active={snippet.query ? true : undefined}>
          <span className="alc-shelf-mode">
            Local <ChevronDown size={12} />
          </span>
          <span className="alc-shelf-divider" />
          <Search size={18} className="alc-shelf-search-icon" />
          {snippet.query ? (
            <span className="alc-snippet-query">{snippet.query}</span>
          ) : (
            <span className="alc-snippet-query is-empty">Search shortcuts, apps, files and commands...</span>
          )}
        </div>
      </div>
      {snippet.filesOnly && (
        <div className="alc-snippet-filters">
          <span className="alc-snippet-check" />
          Files only
          {['Type: Any', 'Location: Everywhere', 'Time: Forever'].map((f) => (
            <span key={f} className="alc-snippet-chip">
              {f} <ChevronDown size={10} />
            </span>
          ))}
        </div>
      )}
      {snippet.sections.map((section) => (
        <div key={section.label}>
          <div className="alc-shelf-section">
            <span>{section.label}</span>
          </div>
          <ul className="alc-snippet-rows">
            {section.rows.map((row) => {
              const selected = first;
              first = false;
              return (
                <li key={row.name} className="alc-shelf-row" aria-selected={selected}>
                  <span className="alc-shelf-row-icon">
                    <RowIcon icon={row.icon} />
                  </span>
                  <span className="alc-shelf-row-text">
                    <span className="alc-shelf-row-name">
                      <Highlight text={row.name} query={section.label === 'Answer' ? '' : snippet.query} />
                    </span>
                    <span className="alc-shelf-row-detail">{row.detail}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
