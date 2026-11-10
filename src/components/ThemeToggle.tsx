import { useCallback } from "react";
import { THEMES, getSiteThemeId, setSiteTheme, themeById } from "../config/themes";

export default function ThemeToggle() {
  const toggle = useCallback(() => {
    const active = themeById(getSiteThemeId() ?? "");
    const dark = active
      ? active.variant === "dark"
      : document.documentElement.getAttribute("data-theme") !== "light";
    const variant = dark ? "light" : "dark";
    const pool = THEMES.filter((t) => t.variant === variant);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setSiteTheme(next.id);
    try {
      localStorage.setItem("alcove-theme", variant);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Switch between light and dark theme"
      onClick={toggle}
    >
      <svg
        className="i-sun"
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </svg>
      <svg
        className="i-moon"
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
