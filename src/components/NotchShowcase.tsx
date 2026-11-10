import { useEffect, useState } from 'react';
import DemoNotch from './DemoNotch';
import type { NotchStage } from './DemoNotch';
import { themeById, useSiteThemeId } from '../config/themes';
import { demoNotchPins } from '../config/demo';

const CYCLE: Record<NotchStage, { next: NotchStage; after: number }> = {
  closed: { next: 'compact', after: 1200 },
  compact: { next: 'expanded', after: 3000 },
  expanded: { next: 'closed', after: 3500 },
};

const reducedMotion =() => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function NotchShowcase() {
  const themeId = useSiteThemeId() ?? 'alcove';
  const [stage, setStage] = useState<NotchStage>('closed');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reducedMotion()) {
      setStage('expanded');
      return;
    }
    if (paused) return;
    const { next, after } = CYCLE[stage];
    const t = setTimeout(() => setStage(next), after);
    return () => clearTimeout(t);
  }, [stage, paused]);

  return (
    <div className="hm-notch-live" onPointerEnter={() => {
        setPaused(true);
        setStage((s) => (s === 'closed' ? 'compact' : s));
      }} onPointerLeave={() => setPaused(false)}>
      <DemoNotch
        stage={stage}
        themeClass={`theme-${themeId}`}
        frosted={!!themeById(themeId)?.frosted}
        keepAwake={false}
        onExpand={() => setStage('expanded')}
        onCompact={() => setStage('compact')}
        onAlcove={() => {}}
        onShelf={() => {}}
        onHint={() => {}}
        onPointerEnter={() => {}}
        onPointerLeave={() => {}}
        pinned={demoNotchPins}
      />
    </div>
  );
}
