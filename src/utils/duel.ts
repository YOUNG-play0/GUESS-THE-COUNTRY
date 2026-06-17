import { Question, QuestionType } from '../types';
import { countries, getRandomCountries } from '../data/countries';
import { countryShapes } from '../data/countryShapes';

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

// Génère un set de questions pour le 1v1 (mêmes questions pour le joueur et ATLAS).
export function generateDuelQuestions(count = 10): Question[] {
  const picked = shuffle(countries).slice(0, count);
  return picked.map(country => {
    const types: QuestionType[] = ['flag', 'capital', 'hint'];
    if (country.monument) types.push('monument');
    if (countryShapes[country.name]) types.push('shape');
    const type = types[Math.floor(Math.random() * types.length)];
    const wrong = getRandomCountries(3, undefined, [country.name]).map(c => c.name);
    const options = shuffle([country.name, ...wrong]);
    const hintIndex = type === 'hint' ? Math.floor(Math.random() * country.hints.length) : undefined;
    return { type, country, options, correctAnswer: country.name, hintIndex };
  });
}

// ——— Historique des duels (localStorage) ———
export interface DuelRecord {
  date: number;
  playerScore: number;
  atlasScore: number;
  won: boolean;
}

const HISTORY_KEY = 'gtc_duel_history';

export function loadDuelHistory(): DuelRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveDuelResult(playerScore: number, atlasScore: number): DuelRecord[] {
  const history = loadDuelHistory();
  const rec: DuelRecord = { date: Date.now(), playerScore, atlasScore, won: playerScore > atlasScore };
  const next = [rec, ...history].slice(0, 50);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
  return next;
}

export function duelStats(): { played: number; won: number } {
  const h = loadDuelHistory();
  return { played: h.length, won: h.filter(r => r.won).length };
}
