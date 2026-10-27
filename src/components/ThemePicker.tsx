import SectionHeader from "./SectionHeader";
import {
  THEMES,
  themeById,
  useSiteThemeId,
  setSiteTheme,
} from "../config/themes";
import type { AlcoveTheme } from "../config/themes";

const groups: { title: string; items: AlcoveTheme[] }[] = [
  {
    title: "Dark",
    items: THEMES.filter(
      (t) => t.variant === "dark" && !t.translucent && !t.retro,
    ),
  },
  {
    title: "Light",
    items: THEMES.filter(
      (t) => t.variant === "light" && !t.translucent && !t.retro,
    ),
  },
  { title: "Special", items: THEMES.filter((t) => t.translucent || t.retro) },
];

interface Props {
  headless?: boolean;
}

export default function ThemePicker({ headless = false }: Props) {
  const activeId = useSiteThemeId();
  const active = activeId ? themeById(activeId) : undefined;
  const Wrapper = headless ? "div" : "section";

  return (
    <Wrapper
      className={headless ? "themes-sec" : "home-section themes-sec"}
      aria-labelledby={headless ? undefined : "themes-heading"}
    >
      {!headless && (
        <SectionHeader id="themes-heading" title="Forty themes. Pick one.">
          The same forty the app ships. Pick one and this site wears it too.
        </SectionHeader>
      )}
      <div className="theme-groups">
        {groups.map((g) => (
          <div className="theme-group" key={g.title}>
            <h3>{g.title}</h3>
            <ul>
              {g.items.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className="theme-chip"
                    aria-pressed={t.id === activeId}
                    onClick={() => setSiteTheme(t.id)}
                  >
                    <span
                      className="theme-swatch"
                      style={{
                        background: t.color,
                        borderColor: t.translucent
                          ? "var(--border-strong)"
                          : undefined,
                      }}
                    >
                      <span
                        className="theme-swatch-dot"
                        style={{ background: t.accent }}
                      />
                    </span>
                    <span className="theme-chip-name">{t.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="theme-readout">
        {active ? (
          <>
            <span className="theme-swatch" style={{ background: active.color }}>
              <span
                className="theme-swatch-dot"
                style={{ background: active.accent }}
              />
            </span>
            Wearing {active.name}.
          </>
        ) : (
          "Wearing the default."
        )}
      </p>
    </Wrapper>
  );
}
