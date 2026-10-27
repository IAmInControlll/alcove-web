import { THEMES } from '../config/themes';

interface Props {
  activeId: string;
  onPick: (id: string) => void;
}

export default function DemoThemeMenu({ activeId, onPick }: Props) {
  const active = THEMES.find((t) => t.id === activeId) ?? THEMES[0];
  return (
    <div className="ad-menu" role="dialog" aria-label="Themes">
      <p className="ad-menu-title">
        <span>Theme</span>
        <span>{active.name}</span>
      </p>
      <ul className="ad-swatches">
        {THEMES.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              className="ad-swatch"
              title={t.name}
              aria-label={t.name}
              aria-pressed={t.id === active.id}
              onClick={() => onPick(t.id)}
              style={{ background: t.color, '--swatch-accent': t.accent } as React.CSSProperties}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
