import { Check } from 'lucide-react';
import type { DemoTaskId } from '../config/demo';

interface Props {
  tasks: { id: DemoTaskId; label: string }[];
  done: DemoTaskId[];
}

export default function DemoSticky({ tasks, done }: Props) {
  const count = tasks.filter((t) => done.includes(t.id)).length;

  return (
    <aside className="alc-sticky" aria-label="Things to try">
      <header className="alc-sticky-head">
        <span>Things to try</span>
        <span className="alc-sticky-count">
          {count}/{tasks.length}
        </span>
      </header>
      <ul>
        {tasks.map((t) => {
          const isDone = done.includes(t.id);
          return (
            <li key={t.id} data-done={isDone || undefined}>
              <span className="alc-sticky-box" aria-hidden="true">
                {isDone && <Check size={11} strokeWidth={3} />}
              </span>
              <span>{t.label}</span>
            </li>
          );
        })}
      </ul>
      <p className="alc-sticky-tip">Shortcuts not working? Use the buttons above.</p>
      {count === tasks.length && <p className="alc-sticky-done">That is the lot. The real one is free.</p>}
      <span className="sr-only" aria-live="polite">
        {count} of {tasks.length} done
      </span>
    </aside>
  );
}
