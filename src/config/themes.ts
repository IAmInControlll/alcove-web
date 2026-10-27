import { useEffect, useState } from 'react';

export type ThemeVariant = 'dark' | 'light';
export type ThemeCorners = 'round' | 'small' | 'square';

export interface AlcoveTheme {
  id: string;
  name: string;
  color: string;
  accent: string;
  corners: ThemeCorners;
  variant: ThemeVariant;
  translucent?: boolean;
  retro?: boolean;
  scene?: boolean;
}

export const THEMES: AlcoveTheme[] = [
  { id: 'alcove', name: 'Alcove', color: '#111318', accent: '#58E5BB', corners: 'round', variant: 'dark' },
  { id: 'noir', name: 'Noir', color: '#1a1a1a', accent: '#909090', corners: 'small', variant: 'dark' },
  { id: 'mono', name: 'Mono', color: '#000000', accent: '#ffffff', corners: 'small', variant: 'dark' },
  { id: 'nord', name: 'Nord', color: '#2e3440', accent: '#88c0d0', corners: 'round', variant: 'dark' },
  { id: 'blueprint', name: 'Blueprint', color: '#0b3d91', accent: '#ffffff', corners: 'square', variant: 'dark' },
  { id: 'navy', name: 'Navy', color: '#0c1120', accent: '#3a82ff', corners: 'round', variant: 'dark' },
  { id: 'midnight', name: 'Midnight', color: '#1a1a2e', accent: '#6366f1', corners: 'round', variant: 'dark' },
  { id: 'solarized-dark', name: 'Solarized Dark', color: '#002b36', accent: '#268bd2', corners: 'round', variant: 'dark' },
  { id: 'dracula', name: 'Dracula', color: '#282a36', accent: '#bd93f9', corners: 'round', variant: 'dark' },
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha', color: '#1e1e2e', accent: '#cba6f7', corners: 'round', variant: 'dark' },
  { id: 'rose-pine', name: 'Rose Pine', color: '#1f1a27', accent: '#ebbcba', corners: 'round', variant: 'dark' },
  { id: 'crimson', name: 'Crimson', color: '#1a0808', accent: '#dc2626', corners: 'round', variant: 'dark' },
  { id: 'monokai', name: 'Monokai', color: '#272822', accent: '#f92672', corners: 'round', variant: 'dark' },
  { id: 'sunset', name: 'Sunset', color: '#2b1a12', accent: '#f97316', corners: 'round', variant: 'dark' },
  { id: 'gruvbox', name: 'Gruvbox', color: '#282828', accent: '#d79921', corners: 'round', variant: 'dark' },
  { id: 'amber', name: 'Amber', color: '#0a0a0a', accent: '#ffb000', corners: 'small', variant: 'dark' },
  { id: 'high-contrast', name: 'High Contrast', color: '#000000', accent: '#ffff00', corners: 'square', variant: 'dark' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: '#0d0d0d', accent: '#fcee0a', corners: 'small', variant: 'dark' },
  { id: 'gameboy', name: 'Game Boy', color: '#0f380f', accent: '#9bbc0f', corners: 'square', variant: 'dark' },
  { id: 'matrix', name: 'Matrix', color: '#0a0a0a', accent: '#22c55e', corners: 'small', variant: 'dark' },
  { id: 'forest', name: 'Forest', color: '#1a2a1a', accent: '#22c55e', corners: 'round', variant: 'dark' },
  { id: 'loki', name: 'Loki', color: '#0d3b2e', accent: '#d4af37', corners: 'round', variant: 'dark' },
  { id: 'pine', name: 'Pine', color: '#0f2926', accent: '#14b8a6', corners: 'round', variant: 'dark' },
  { id: 'metro', name: 'Metro', color: '#1a1a1a', accent: '#00b7c3', corners: 'square', variant: 'dark' },
  { id: 'ocean', name: 'Ocean', color: '#0b1f27', accent: '#06b6d4', corners: 'round', variant: 'dark' },
  { id: 'paper', name: 'Paper', color: '#f7f7f5', accent: '#525252', corners: 'round', variant: 'light' },
  { id: 'linen', name: 'Linen', color: '#f5f0e8', accent: '#a87b5d', corners: 'round', variant: 'light' },
  { id: 'notebook', name: 'Notebook', color: '#faf5ec', accent: '#8b6f47', corners: 'round', variant: 'light' },
  { id: 'solarized-light', name: 'Solarized Light', color: '#fdf6e3', accent: '#268bd2', corners: 'round', variant: 'light' },
  { id: 'zudu', name: 'Zudu', color: '#b8d8f0', accent: '#1e6fb8', corners: 'round', variant: 'light', scene: true },
  { id: 'catppuccin-latte', name: 'Catppuccin Latte', color: '#eff1f5', accent: '#8839ef', corners: 'round', variant: 'light' },
  { id: 'lilac', name: 'Lilac', color: '#f8f7fc', accent: '#a78bda', corners: 'round', variant: 'light' },
  { id: 'blossom', name: 'Blossom', color: '#fdf2f8', accent: '#ec4899', corners: 'round', variant: 'light' },
  { id: 'glass', name: 'Glass', color: 'rgba(10,10,20,0.3)', accent: '#60a5fa', corners: 'round', variant: 'dark', translucent: true },
  { id: 'classic', name: 'Classic', color: '#c0c0c0', accent: '#000080', corners: 'square', variant: 'light', retro: true },
  { id: 'luna', name: 'Luna', color: '#ece9d8', accent: '#0054e3', corners: 'square', variant: 'light', retro: true },
  { id: 'silver', name: 'Silver', color: '#e0dfe3', accent: '#4f6b8c', corners: 'square', variant: 'light', retro: true },
  { id: 'aero', name: 'Aero', color: '#ebeef5', accent: '#4b9ad6', corners: 'small', variant: 'light', translucent: true, retro: true },
  { id: 'mica-dark', name: '11 Dark', color: 'rgba(32,32,32,0.3)', accent: '#60cdff', corners: 'round', variant: 'dark', translucent: true },
  { id: 'mica-light', name: '11 Light', color: 'rgba(243,243,243,0.3)', accent: '#005fb8', corners: 'round', variant: 'light', translucent: true },
];

export const STORAGE_KEY = 'alcove-site-theme';

export const themeById = (id: string): AlcoveTheme | undefined =>
  THEMES.find((t) => t.id === id);

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const p = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0');
  return `#${p(r)}${p(g)}${p(b)}`;
}

function mixHex(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

function solidColor(color: string): string {
  if (color.startsWith('#')) return color;
  const m = color.match(/[\d.]+/g);
  if (!m || m.length < 3) return '#111318';
  return rgbToHex(Number(m[0]), Number(m[1]), Number(m[2]));
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

interface ThemeDecor {
  text: string;
  text2: string;
  muted: string;
  border: number;
  strong: number;
}

const DECOR: Record<string, ThemeDecor> = {
  blueprint: { text: '#ffffff', text2: '#c5d9f0', muted: '#6a8ab8', border: 0.25, strong: 0.4 },
  notebook: { text: '#3d3327', text2: '#6b5d4f', muted: '#a89888', border: 0.14, strong: 0.22 },
  zudu: { text: '#1a3a52', text2: '#2d4a63', muted: '#3d5a73', border: 0.12, strong: 0.2 },
};

const INK = {
  dark: {
    text: '#E8EBEE',
    secondary: '#B8BFC8',
    muted: '#7A828D',
    rgb: '255, 255, 255',
    surface: 0.04,
    surfaceHover: 0.08,
    border: 0.1,
    borderStrong: 0.18,
    codeBg: 0.07,
    shadow: '0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.45)',
    raisedMix: 0.045,
  },
  light: {
    text: '#16181D',
    secondary: '#3A3F47',
    muted: '#6B7280',
    rgb: '22, 24, 29',
    surface: 0.04,
    surfaceHover: 0.07,
    border: 0.12,
    borderStrong: 0.2,
    codeBg: 0.06,
    shadow: '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)',
    raisedMix: 0.55,
  },
} as const;

export function siteThemeVars(theme: AlcoveTheme): Record<string, string> {
  const light = theme.variant === 'light';
  const v = light ? INK.light : INK.dark;
  const bg = solidColor(theme.color);
  const d = DECOR[theme.id];
  const inkRgb = d ? hexToRgb(theme.accent).join(', ') : v.rgb;
  const radii =
    theme.corners === 'round'
      ? ['8px', '4px']
      : theme.corners === 'small'
        ? ['4px', '2px']
        : ['0px', '0px'];
  return {
    '--bg': bg,
    '--bg-raised': mixHex(bg, '#ffffff', v.raisedMix),
    '--text': d?.text ?? v.text,
    '--text-secondary': d?.text2 ?? v.secondary,
    '--text-muted': d?.muted ?? v.muted,
    '--accent': theme.accent,
    '--accent-hover': mixHex(theme.accent, light ? '#000000' : '#ffffff', 0.2),
    '--accent-bright': theme.accent,
    '--on-accent': luminance(theme.accent) > 0.5 ? '#111318' : '#ffffff',
    '--surface': `rgba(${inkRgb}, ${v.surface})`,
    '--surface-hover': `rgba(${inkRgb}, ${v.surfaceHover})`,
    '--border': `rgba(${inkRgb}, ${d?.border ?? v.border})`,
    '--border-strong': `rgba(${inkRgb}, ${d?.strong ?? v.borderStrong})`,
    '--code-bg': `rgba(${inkRgb}, ${v.codeBg})`,
    '--shadow': v.shadow,
    '--radius': radii[0],
    '--radius-sm': radii[1],
  };
}

let currentId: string | null = null;
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    if (data && themeById(data.id)) currentId = data.id;
  }
} catch {
  /* ignore */
}
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

export function getSiteThemeId() {
  return currentId;
}

export function subscribeSiteTheme(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useSiteThemeId() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    setId(getSiteThemeId());
    return subscribeSiteTheme(() => setId(getSiteThemeId()));
  }, []);
  return id;
}

export function setSiteTheme(id: string) {
  const theme = themeById(id);
  if (!theme) return;
  const root = document.documentElement;
  const vars = siteThemeVars(theme);
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v);
  }
  root.setAttribute('data-theme', theme.variant);
  root.setAttribute('data-site-theme', theme.id);
  currentId = theme.id;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ id: theme.id, variant: theme.variant, vars }),
    );
  } catch {
    /* ignore */
  }
  emit();
}
