import { useEffect, useRef, useState } from 'react';
import DemoNotch from './DemoNotch';
import type { NotchStage } from './DemoNotch';
import { themeById, useSiteThemeId } from '../config/themes';
import { demoNotchPins } from '../config/demo';

type ShowStage = Exclude<NotchStage, 'closed'>;

const CYCLE: Record<ShowStage, { next: ShowStage; after: number }> = {
  compact: { next: 'expanded', after: 3000 },
  expanded: { next: 'compact', after: 6000 },
};

const REST_TO_EXPAND = 700;
const HINT_FOR = 2600;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function NotchShowcase() {
  const themeId = useSiteThemeId() ?? 'alcove';
  const [stage, setStage] = useState<ShowStage>('compact');
  const [hovered, setHovered] = useState(false);
  const [hint, setHint] = useState<{ text: string; key: number } | null>(null);
  const rest = useRef(0);

  useEffect(() => {
    if (hovered || reducedMotion()) return;
    const { next, after } = CYCLE[stage];
    const t = window.setTimeout(() => setStage(next), after);
    return () => window.clearTimeout(t);
  }, [stage, hovered]);

  useEffect(() => {
    if (!hint) return;
    const t = window.setTimeout(() => setHint(null), HINT_FOR);
    return () => window.clearTimeout(t);
  }, [hint]);

  useEffect(() => () => window.clearTimeout(rest.current), []);

  const show = (text: string) => setHint({ text, key: Date.now() });

  return (
    <div
      className="hm-notch-live"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        window.clearTimeout(rest.current);
      }}
    >
      <DemoNotch
        stage={stage}
        themeClass={`theme-${themeId}`}
        frosted={!!themeById(themeId)?.frosted}
        keepAwake={false}
        onExpand={() => setStage('expanded')}
        onCompact={() => setStage('compact')}
        onAlcove={() => show('In the app, this opens Alcove.')}
        onShelf={() => show('In the app, this opens the Shelf.')}
        onHint={show}
        onPointerEnter={() => {
          if (stage === 'compact') rest.current = window.setTimeout(() => setStage('expanded'), REST_TO_EXPAND);
        }}
        onPointerLeave={() => window.clearTimeout(rest.current)}
        pinned={demoNotchPins}
      />
      {hint && (
        <p key={hint.key} className="hm-notch-hint" role="status">
          {hint.text}
        </p>
      )}
    </div>
  );
}
