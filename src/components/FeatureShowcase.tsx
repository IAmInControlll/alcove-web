import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Screenshot from './Screenshot';
import FeatureTab from './FeatureTab';
import type { FeatureTab as FeatureTabData } from '../config/home';

interface Props {
  features: FeatureTabData[];
}

export default function FeatureShowcase({ features }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % features.length);
  }, [features.length]);

  useEffect(() => {
    if (paused || reduce) return;
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reduce, next]);

  const tab = features[active];

  const transitionProps = reduce
    ? { duration: 0 }
    : { duration: 0.35, ease: 'easeOut' as const };

  return (
    <div
      className="showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="showcase-tabs" role="tablist" aria-label="Feature showcase">
        {features.map((f, i) => (
          <button
            key={f.id}
            role="tab"
            id={`tab-${f.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${f.id}`}
            className="showcase-tab"
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                setActive((i + 1) % features.length);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setActive((i - 1 + features.length) % features.length);
              }
            }}
          >
            {f.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab.id}
          className="showcase-panel"
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          initial={reduce ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={transitionProps}
        >
          <Screenshot filename={tab.screenshot} alt={tab.alt} aspectRatio="16 / 9" />
          <FeatureTab feature={tab} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
