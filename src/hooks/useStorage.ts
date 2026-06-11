import { useState, useCallback, useEffect } from 'react';
import { PlayerStats, GameMode } from '../types';

const DEFAULT_STATS: PlayerStats = {
  name: '',
  totalGames: 0,
  totalScore: 0,
  bestScore: 0,
  bestCombo: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  xp: 0,
  level: 1,
  gamesPerMode: { classic: 0, survival: 0, chrono: 0, map: 0 },
  unlockedDifficulties: ['easy'],
};

function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem('gtc_stats');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ...DEFAULT_STATS };
}

function saveStats(stats: PlayerStats) {
  localStorage.setItem('gtc_stats', JSON.stringify(stats));
}

export function useStorage() {
  const [stats, setStats] = useState<PlayerStats>(loadStats);

  useEffect(() => {
    // Cleanup old global leaderboard data from previous versions.
    localStorage.removeItem('gtc_leaderboard');
  }, []);

  const updateStats = useCallback((updates: Partial<PlayerStats>) => {
    setStats(prev => {
      const next = { ...prev, ...updates };
      saveStats(next);
      return next;
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const XP_LEVELS = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000];
      let newLevel = 1;
      for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
        if (newXP >= XP_LEVELS[i]) {
          newLevel = i + 1;
          break;
        }
      }
      const unlockedDiffs = prev.unlockedDifficulties.slice();
      if (newLevel >= 2 && !unlockedDiffs.includes('medium')) unlockedDiffs.push('medium');
      if (newLevel >= 4 && !unlockedDiffs.includes('hard')) unlockedDiffs.push('hard');
      if (newLevel >= 7 && !unlockedDiffs.includes('expert')) unlockedDiffs.push('expert');

      const next = { ...prev, xp: newXP, level: newLevel, unlockedDifficulties: unlockedDiffs };
      saveStats(next);
      return next;
    });
  }, []);

  const recordGame = useCallback((score: number, mode: GameMode, combo: number, correct: number, total: number) => {
    setStats(prev => {
      const next = {
        ...prev,
        totalGames: prev.totalGames + 1,
        totalScore: prev.totalScore + score,
        bestScore: Math.max(prev.bestScore, score),
        bestCombo: Math.max(prev.bestCombo, combo),
        correctAnswers: prev.correctAnswers + correct,
        totalAnswers: prev.totalAnswers + total,
        gamesPerMode: { ...prev.gamesPerMode, [mode]: prev.gamesPerMode[mode] + 1 },
      };
      saveStats(next);
      return next;
    });
  }, []);

  // Dépense d'XP (gel de série...). Le niveau et les difficultés débloquées
  // ne redescendent jamais : l'XP sert aussi de monnaie.
  const spendXP = useCallback((amount: number): boolean => {
    if (stats.xp < amount) return false;
    const next = { ...stats, xp: stats.xp - amount };
    setStats(next);
    saveStats(next);
    return true;
  }, [stats]);

  const setPlayerName = useCallback((name: string) => {
    updateStats({ name });
  }, [updateStats]);

  return {
    stats,
    updateStats,
    addXP,
    spendXP,
    recordGame,
    setPlayerName,
  };
}
