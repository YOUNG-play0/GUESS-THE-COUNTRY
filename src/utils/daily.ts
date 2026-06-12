import { Question, QuestionType } from '../types';
import { countries } from '../data/countries';
import { countryShapes } from '../data/countryShapes';

// Défi du jour : 5 questions générées depuis la date — déterministes,
// donc identiques pour tous les joueurs un jour donné (aucun serveur).

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const DAILY_QUESTION_COUNT = 5;

export function generateDailyQuestions(dateKey: string): Question[] {
  const rng = mulberry32(hashString(`gtc-daily-${dateKey}`));
  const shuffled = seededShuffle(countries, rng);
  const picked = shuffled.slice(0, DAILY_QUESTION_COUNT);

  return picked.map(country => {
    const types: QuestionType[] = ['flag', 'capital', 'hint'];
    if (country.monument) types.push('monument');
    if (countryShapes[country.name]) types.push('shape');
    const type = types[Math.floor(rng() * types.length)];

    const wrong = seededShuffle(shuffled.filter(c => c.name !== country.name), rng)
      .slice(0, 3)
      .map(c => c.name);
    const options = seededShuffle([country.name, ...wrong], rng);
    const hintIndex = type === 'hint' ? Math.floor(rng() * country.hints.length) : undefined;

    return { type, country, options, correctAnswer: country.name, hintIndex };
  });
}
