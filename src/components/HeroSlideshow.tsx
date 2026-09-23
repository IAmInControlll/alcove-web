import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import Screenshot from './Screenshot';
import { screenshotUrl } from '../config/screenshots';
import type { HeroSlide } from '../config/home';

interface Props {
  slides: HeroSlide[];
  interval?: number;
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  );
}

export default function HeroSlideshow({ slides, interval = 4500 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const available = slides
    .map((s) => ({ ...s, src: screenshotUrl(s.screenshot) }))
    .filter((s): s is HeroSlide & { src: string } => Boolean(s.src));
  const count = available.length;

  const go = (step: number) => setActive((i) => (i + step + count) % count);

  useEffect(() => {
    if (paused || reduce || count < 2) return;
    const id = setTimeout(() => {
      if (!document.hidden) go(1);
    }, interval);
    return () => clearTimeout(id);
  }, [active, paused, reduce, count, interval]);

  if (count === 0) {
    return <Screenshot filename={slides[0]?.screenshot ?? 'hero-1.webp'} alt="" aspectRatio="16 / 9" />;
  }

  return (
    <div
      className="hero-slideshow-wrap"
      role="region"
      aria-roledescription="carousel"
      aria-label="Alcove screenshots"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
      }}
    >
      <div className="showcase-visual hero-slideshow">
        {available.map((s, i) => (
          <img
            key={s.screenshot}
            className={`hero-slide${i === active ? ' is-active' : ''}`}
            src={s.src}
            alt={s.alt}
            aria-hidden={i !== active}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        {count > 1 && (
          <>
            <button type="button" className="hero-arrow hero-arrow-prev" aria-label="Previous screenshot" onClick={() => go(-1)}>
              <Chevron direction="left" />
            </button>
            <button type="button" className="hero-arrow hero-arrow-next" aria-label="Next screenshot" onClick={() => go(1)}>
              <Chevron direction="right" />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="hero-dots">
          {available.map((s, i) => (
            <button
              key={s.screenshot}
              type="button"
              className="hero-dot"
              aria-label={`Show screenshot ${i + 1} of ${count}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
