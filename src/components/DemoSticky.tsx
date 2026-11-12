import { Check, ChevronDown } from 'lucide-react';
import type { DemoTaskId } from '../config/demo';

const DONE_MESSAGE = "You're a natural at this! Try the real app, it's even better :)";

interface Props {
  tasks: { id: DemoTaskId; label: string }[];
  done: DemoTaskId[];
  current: DemoTaskId | null;
  open: boolean | null;
  expanded: boolean;
  onToggle: () => void;
}

export default function DemoSticky({ tasks, done, current, open, expanded, onToggle }: Props) {
  const count = tasks.filter((t) => done.includes(t.id)).length;
  const next = tasks.find((t) => !done.includes(t.id));
  const now = tasks.find((t) => t.id === current);

  return (
    <aside className="alc-sticky" aria-label="Things to try" data-open={open === null ? undefined : String(open)}>
      <button type="button" className="alc-sticky-head" aria-expanded={expanded} aria-controls="alc-sticky-body" onClick={onToggle}>
        <span>Things to try</span>
        <span className="alc-sticky-count">
          {count}/{tasks.length}
          <ChevronDown size={14} strokeWidth={2.5} aria-hidden="true" />
        </span>
      </button>
      <div className="alc-sticky-now" aria-hidden="true">
        {now ? (
          <p key={now.id} data-done={done.includes(now.id) || undefined}>
            <span className="alc-sticky-box">{done.includes(now.id) && <Check size={11} strokeWidth={3} />}</span>
            <span>{now.label}</span>
          </p>
        ) : (
          <p key="done">{DONE_MESSAGE}</p>
        )}
      </div>
      <div className="alc-sticky-body" id="alc-sticky-body">
        <ul>
          {tasks.map((t) => {
            const isDone = done.includes(t.id);
            return (
              <li key={t.id} data-done={isDone || undefined} data-next={t.id === next?.id || undefined}>
                <span className="alc-sticky-box" aria-hidden="true">
                  {isDone && <Check size={11} strokeWidth={3} />}
                </span>
                <span>{t.label}</span>
              </li>
            );
          })}
        </ul>
        <p className="alc-sticky-tip">Shortcuts not working? Use the buttons above.</p>
        {count === tasks.length && <p className="alc-sticky-done">{DONE_MESSAGE}</p>}
      </div>
      <span className="sr-only" aria-live="polite">
        {count} of {tasks.length} done
      </span>
    </aside>
  );
}
