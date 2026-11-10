import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface FitFocus {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Props {
  width: number;
  height: number;
  label: string;
  focus?: FitFocus;
  interactive?: boolean;
  children: ReactNode;
}

export default function ScaledFit({ width, height, label, focus, interactive = false, children }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const area = focus ?? { x: 0, y: 0, w: width, h: height };
  const scale = Math.min(size.w / area.w, size.h / area.h);
  const left = size.w / 2 - (area.x + area.w / 2) * scale;
  const top = size.h / 2 - (area.y + area.h / 2) * scale;

  return (
    <div
      ref={box}
      className={focus ? 'hm-fit is-focused' : 'hm-fit'}
      role={interactive ? undefined : 'img'}
      aria-label={interactive ? undefined : label}
    >
      <div className="hm-fit-inner" style={{ width, height, left, top, transform: `scale(${scale})` }} inert={!interactive}>
        {children}
      </div>
    </div>
  );
}
