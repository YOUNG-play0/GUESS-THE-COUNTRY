import { useState, useCallback } from 'react';
import { GameMode } from '../types';
import { hashString, mulberry32, seededShuffle } from '../utils/daily';

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

export type QuestId = 'correct' | 'combo' | 'continent' | 'games' | 'score' | 'flags';

export interface QuestItem {
  id: QuestId;
  target: number;
  progress: number;
  done: boolean;
  continent?: string;
}

/** Résumé d'une partie terminée, transmis par App à la fin de chaque jeu */
export interface GameSummary {
  mode: GameMode;
  score: number;
  bestCombo: number;
  correctAnswers: number;
  correctByContinent: Record<string, number>;
  correctFlags: number;
  correctCountries: string[];
}

export interface ProgressState {
  streak: StreakState;
  daily: DailyState | null;
  quests: { date: string; items: QuestItem[] } | null;
}

export const QUEST_XP_REWARD = 30;
const CONTINENTS = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];
const QUEST_TARGETS: Record<QuestId, number> = {
  correct: 15, combo: 5, continent: 8, games: 3, score: 300, flags: 10,
};

// 3 quêtes par jour, tirées de façon déterministe depuis la date
// (les mêmes pour tous les joueurs, comme le défi du jour).
export function generateQuests(dateKey: string): QuestItem[] {
  const rng = mulberry32(hashString(`gtc-quests-${dateKey}`));
  const ids: QuestId[] = ['correct', 'combo', 'continent', 'games', 'score', 'flags'];
  return seededShuffle(ids, rng).slice(0, 3).map(id => ({
    id,
    target: QUEST_TARGETS[id],
    progress: 0,
    done: false,
    continent: id === 'continent' ? CONTINENTS[Math.floor(rng() * CONTINENTS.length)] : undefined,
  }));
}

function applyGameToQuests(items: QuestItem[], g: GameSummary): { items: QuestItem[]; xpGained: number } {
  let xpGained = 0;
  const next = items.map(q => {
    if (q.done) return q;
    let progress = q.progress;
    switch (q.id) {
      case 'correct': progress += g.correctAnswers; break;
      case 'combo': progress = Math.max(progress, g.bestCombo); break;
      case 'continent': progress += g.correctByContinent[q.continent ?? ''] ?? 0; break;
      case 'games': progress += 1; break;
      case 'score': progress = Math.max(progress, g.score); break;
      case 'flags': progress += g.correctFlags; break;
    }
    progress = Math.min(progress, q.target);
    const done = progress >= q.target;
    if (done) xpGained += QUEST_XP_REWARD;
    return { ...q, progress, done };
  });
  return { items: next, xpGained };
}

const STORAGE_KEY = 'gtc_progress';
export const FREEZE_COST_XP = 200;
export const MAX_FREEZES = 2;

const DEFAULT_PROGRESS: ProgressState = {
  streak: { count: 0, lastDay: '', freezes: 0 },
  daily: null,
  quests: null,
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

  const questsToday: QuestItem[] =
    progress.quests && progress.quests.date === todayKey()
      ? progress.quests.items
      : generateQuests(todayKey());

  // Met à jour les quêtes avec le résumé de la partie et retourne l'XP
  // gagné par les quêtes nouvellement accomplies (calcul hors setState :
  // les updaters peuvent être rejoués par React en StrictMode).
  const applyGameSummary = useCallback((summary: GameSummary): number => {
    const today = todayKey();
    const base = progress.quests && progress.quests.date === today
      ? progress.quests.items
      : generateQuests(today);
    const { items, xpGained } = applyGameToQuests(base, summary);
    update(p => ({ ...p, quests: { date: today, items } }));
    return xpGained;
  }, [progress.quests, update]);

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
    questsToday,
    applyGameSummary,
  };
}
