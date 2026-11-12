import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import DemoTitleBar from './DemoTitleBar';
import DemoCrumbs from './DemoCrumbs';
import DemoColumnHeaders from './DemoColumnHeaders';
import type { SortColumn, SortDir } from './DemoColumnHeaders';
import DemoFileList from './DemoFileList';
import DemoPeek from './DemoPeek';
import type { DemoEntry } from '../config/demo';
import type { FAQGroup } from '../config/home';
import { themeById, useSiteThemeId } from '../config/themes';
import '../styles/app-themes.css';

interface Props {
  groups: FAQGroup[];
  helpHref: string;
}

interface Question {
  entry: DemoEntry;
  question: string;
  answer: string;
}

const noop = () => {};
const plain = (html: string) => html.replace(/<[^>]+>/g, '');
const day = (n: number) => `2026-10-${String(n).padStart(2, '0')}`;

function toQuestions(groups: FAQGroup[]): Question[] {
  return groups
    .flatMap((g) => g.items)
    .map((item, i) => ({
      question: item.question,
      answer: item.answer,
      entry: {
        name: `${item.question}.txt`,
        size: new TextEncoder().encode(plain(item.answer)).length,
        created: day(1 + i),
        modified: day(12 + i),
      },
    }));
}

function sortBy(list: Question[], sort: { column: SortColumn; dir: SortDir } | null) {
  if (!sort) return list;
  const key = (q: Question) => (sort.column === 'name' ? q.question.toLowerCase() : sort.column === 'size' ? q.entry.size : q.entry[sort.column]);
  const sorted = [...list].sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
  return sort.dir === 'asc' ? sorted : sorted.reverse();
}

export default function FAQWindow({ groups, helpHref }: Props) {
  const themeId = useSiteThemeId() ?? 'alcove';
  const theme = themeById(themeId);
  const questions = useMemo(() => toQuestions(groups), [groups]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ column: SortColumn; dir: SortDir } | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [open, setOpen] = useState<Question | null>(null);
  const win = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const shown = sortBy(
    questions.filter((x) => !q || x.question.toLowerCase().includes(q) || plain(x.answer).toLowerCase().includes(q)),
    sort,
  );

  const close = () => {
    const name = open?.entry.name;
    setOpen(null);
    if (name) requestAnimationFrame(() => win.current?.querySelector<HTMLButtonElement>(`.alc-row[data-name="${CSS.escape(name)}"]`)?.focus());
  };

  useEffect(() => {
    if (!open) return;
    win.current?.querySelector<HTMLButtonElement>('.alc-peek-head button')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest('.alc-faq .alc-peek, .alc-faq .alc-row')) close();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <div className="hm-faq">
      <p className="hm-faq-intro">Click through the files below to see the answers:</p>
      <div className="hm-faq-stage">
        <div
          ref={win}
          className={`alc-app theme-${themeId} alc-window alc-faq`}
          data-translucent={theme?.translucent || undefined}
          style={{ '--alc-corner': `${theme?.corners === 'square' ? 0 : theme?.corners === 'small' ? 4 : 8}px` } as React.CSSProperties}
        >
          <div className="scene-layer" aria-hidden="true" />
          <div className="alc-faq-chrome" inert>
            <DemoTitleBar
              hint="Click a question to peek at the answer."
              hintVisible
              menuOpen={false}
              toolbarVisible
              onShelf={noop}
              onNotch={noop}
              onSettings={noop}
              onHide={noop}
              onToggleToolbar={noop}
            />
          </div>
          <div className="alc-toolbar">
            <DemoCrumbs crumbs={['Questions']} onCrumb={noop} />
            <span className="alc-spacer" />
            <label className="alc-search">
              <Search size={12} aria-hidden="true" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." aria-label="Search the questions" />
              {query && (
                <button type="button" className="alc-search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
                  <X size={12} />
                </button>
              )}
            </label>
          </div>
          <DemoColumnHeaders
            column={sort?.column ?? null}
            dir={sort?.dir ?? 'asc'}
            onSort={(column) => setSort((s) => ({ column, dir: s?.column === column && s.dir === 'asc' ? 'desc' : 'asc' }))}
          />
          <div className="alc-grid grid-surface" data-list="">
            <DemoFileList
              entries={shown.map((x) => x.entry)}
              focused={focused}
              onFocus={setFocused}
              onOpen={(entry) => {
                setFocused(entry.name);
                setOpen(questions.find((x) => x.entry.name === entry.name) ?? null);
              }}
            />
            {shown.length === 0 && (
              <p className="alc-faq-empty">
                No questions match. Try the <a href={helpHref}>help page</a>.
              </p>
            )}
          </div>
          {open && (
            <div className="alc-peek-layer">
              <DemoPeek key={open.entry.name} title={open.entry.name} path={`Home\\Questions\\${open.entry.name}`} themeClass={`theme-${themeId}`} onClose={close}>
                <div className="alc-faq-answer">
                  <h3>{open.question}</h3>
                  <p dangerouslySetInnerHTML={{ __html: open.answer }} />
                </div>
              </DemoPeek>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
