import { useState, useCallback } from 'react';

// Progression « méta » du joueur (hors stats de parties) : série de jours,
// défi du jour, quêtes, passeport, succès. Tout est local (localStorage).

export interface StreakState {
  count: number;
  lastDay: string; // YYYY-MM-DD local
  freezes: number;
}

export interface DailyState {
  date: string;   // YYYY-MM-DD du défi tenté
  correct: number;
  total: number;
  finished: boolean;
}

export interface ProgressState {
  streak: StreakState;
  daily: DailyState | null;
}

const STORAGE_KEY = 'gtc_progress';
export const FREEZE_COST_XP = 200;
export const MAX_FREEZES = 2;

const DEFAULT_PROGRESS: ProgressState = {
  streak: { count: 0, lastDay: '', freezes: 0 },
  daily: null,
};

export function todayKey(date = new Date()): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

function daysBetween(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split('-').map(Number);
  const [ty, tm, td] = toKey.split('-').map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000);
}

// Jouer aujourd'hui prolonge la série ; un jour manqué est couvert par un
// gel (❄️) s'il en reste, sinon la série repart à 1.
function bumpStreak(s: StreakState): StreakState {
  const today = todayKey();
  if (s.lastDay === today) return s;
  if (!s.lastDay) return { ...s, count: 1, lastDay: today };
  const gap = daysBetween(s.lastDay, today);
  if (gap === 1) return { ...s, count: s.count + 1, lastDay: today };
  if (gap === 2 && s.freezes > 0) return { count: s.count + 1, lastDay: today, freezes: s.freezes - 1 };
  return { ...s, count: 1, lastDay: today };
}

// Série affichée : encore vivante si on a joué aujourd'hui ou hier,
// ou si un gel peut couvrir le seul jour manqué.
export function aliveStreak(s: StreakState): number {
  if (!s.lastDay) return 0;
  const gap = daysBetween(s.lastDay, todayKey());
  if (gap <= 1) return s.count;
  if (gap === 2 && s.freezes > 0) return s.count;
  return 0;
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROGRESS, ...parsed, streak: { ...DEFAULT_PROGRESS.streak, ...parsed.streak } };
    }
  } catch {}
  return DEFAULT_PROGRESS;
}

function saveProgress(p: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  const update = useCallback((fn: (p: ProgressState) => ProgressState) => {
    setProgress(prev => {
      const next = fn(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  // À appeler à chaque partie terminée (n'importe quel mode)
  const touchStreak = useCallback(() => {
    update(p => ({ ...p, streak: bumpStreak(p.streak) }));
  }, [update]);

  const addFreeze = useCallback(() => {
    update(p => p.streak.freezes >= MAX_FREEZES ? p : { ...p, streak: { ...p.streak, freezes: p.streak.freezes + 1 } });
  }, [update]);

  // L'unique tentative du jour est consommée dès le lancement du défi
  // (quitter en cours de route ne permet pas de retenter).
  const startDaily = useCallback((total: number) => {
    update(p => ({ ...p, daily: { date: todayKey(), correct: 0, total, finished: false } }));
  }, [update]);

  const finishDaily = useCallback((correct: number) => {
    update(p => p.daily && p.daily.date === todayKey()
      ? { ...p, daily: { ...p.daily, correct, finished: true } }
      : p);
  }, [update]);

  const dailyToday: DailyState | null =
    progress.daily && progress.daily.date === todayKey() ? progress.daily : null;

  return {
    progress,
    update,
    streak: aliveStreak(progress.streak),
    freezes: progress.streak.freezes,
    touchStreak,
    addFreeze,
    dailyToday,
    startDaily,
    finishDaily,
  };
}
