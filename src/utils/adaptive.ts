import { Difficulty, DIFFICULTY_LADDER } from '../types';

// Difficulté adaptative : plus de choix manuel. Le jeu suit les 10
// dernières réponses (tous modes confondus, persistées entre les parties) :
//   taux de réussite > 80 % → on monte d'un cran
//   taux de réussite < 50 % → on descend d'un cran
// Un délai de 3 réponses entre deux ajustements évite les oscillations.

const STORAGE_KEY = 'gtc_adaptive';
const WINDOW_SIZE = 10;
const COOLDOWN = 3;
const UP_THRESHOLD = 0.8;
const DOWN_THRESHOLD = 0.5;

interface AdaptiveState {
  history: number[]; // 1 = bonne réponse, 0 = erreur (10 dernières)
  difficulty: Difficulty;
  sinceChange: number;
}

const DEFAULT_STATE: AdaptiveState = { history: [], difficulty: 'easy', sinceChange: 0 };

function load(): AdaptiveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = { ...DEFAULT_STATE, ...JSON.parse(raw) };
      if (!DIFFICULTY_LADDER.includes(parsed.difficulty)) parsed.difficulty = 'easy';
      return parsed;
    }
  } catch {}
  return { ...DEFAULT_STATE };
}

function save(s: AdaptiveState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

let state = load();

export function getAdaptiveDifficulty(): Difficulty {
  return state.difficulty;
}

/** Enregistre une réponse et ajuste éventuellement la difficulté cible. */
export function recordAdaptiveAnswer(correct: boolean): { difficulty: Difficulty; changed: boolean } {
  const history = [...state.history, correct ? 1 : 0].slice(-WINDOW_SIZE);
  let { difficulty, sinceChange } = state;
  sinceChange++;
  let changed = false;

  if (history.length >= WINDOW_SIZE && sinceChange >= COOLDOWN) {
    const rate = history.reduce((a, b) => a + b, 0) / history.length;
    const idx = DIFFICULTY_LADDER.indexOf(difficulty);
    if (rate > UP_THRESHOLD && idx < DIFFICULTY_LADDER.length - 1) {
      difficulty = DIFFICULTY_LADDER[idx + 1];
      changed = true;
      sinceChange = 0;
    } else if (rate < DOWN_THRESHOLD && idx > 0) {
      difficulty = DIFFICULTY_LADDER[idx - 1];
      changed = true;
      sinceChange = 0;
    }
  }

  state = { history, difficulty, sinceChange };
  save(state);
  return { difficulty, changed };
}
