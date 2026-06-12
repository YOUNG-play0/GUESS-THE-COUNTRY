// Thèmes visuels (Passe du Savoir) : variantes du fond d'écran global.
// Les classes Tailwind doivent rester des littéraux pour être compilées.

export interface ThemeDef {
  id: string;
  emoji: string;
  /** Classes du dégradé de fond (WorldBackground) */
  gradient: string;
}

export const THEMES: ThemeDef[] = [
  { id: 'cosmos', emoji: '🌌', gradient: 'from-slate-950 via-indigo-950 to-slate-900' },
  { id: 'sunset', emoji: '🌅', gradient: 'from-slate-950 via-rose-950 to-amber-950' },
  { id: 'jungle', emoji: '🌿', gradient: 'from-slate-950 via-emerald-950 to-teal-950' },
  { id: 'ocean', emoji: '🌊', gradient: 'from-slate-950 via-cyan-950 to-blue-950' },
];

export const DEFAULT_THEME = 'cosmos';
const STORAGE_KEY = 'gtc_theme';

export function getStoredTheme(): string {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    if (id && THEMES.some(t => t.id === id)) return id;
  } catch {}
  return DEFAULT_THEME;
}

export function storeTheme(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {}
}

export function themeGradient(id: string): string {
  return (THEMES.find(t => t.id === id) ?? THEMES[0]).gradient;
}
