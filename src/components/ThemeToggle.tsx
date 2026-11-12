import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { THEMES, getSiteThemeId, setSiteTheme, themeById } from "../config/themes";

function useThemeHint() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => setShow(true), 800);
    };
    const observer = new MutationObserver(() => {
      if (root.hasAttribute("data-intro")) return;
      observer.disconnect();
      start();
    });
    if (root.hasAttribute("data-intro")) observer.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
    else start();
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);
  return [show, () => setShow(false)] as const;
}

export default function ThemeToggle() {
  const [hint, dismissHint] = useThemeHint();
  const toggle = useCallback(() => {
    dismissHint();
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
  }, [dismissHint]);

  return (
    <span className="theme-toggle-wrap">
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
    {hint && (
      <span className="theme-hint" role="status">
        Click here to cycle through our themes!
        <button type="button" className="theme-hint-close" aria-label="Dismiss" onClick={dismissHint}>
          <X size={13} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </span>
    )}
    </span>
  );
}
