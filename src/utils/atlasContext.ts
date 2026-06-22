// Contexte de jeu transmis à ATLAS : 5 dernières questions + précision par
// continent (pour qu'il réagisse spécifiquement, jamais de manière générique).

const RECENT_KEY = 'gtc_atlas_recent';
const CONT_KEY = 'gtc_atlas_cont_acc';

export interface RecentQuestion {
  name: string;       // nom du pays (localisé pour ATLAS)
  continent: string;
  type: string;       // flag / capital / hint / shape / monument...
  correct: boolean;
  difficulty: string;
}

export interface ContinentAcc { correct: number; total: number }

function load<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch {}
  return fallback;
}
function save(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

// Enregistre une réponse (appelé à chaque question résolue).
export function recordAnswer(q: RecentQuestion) {
  const recent = load<RecentQuestion[]>(RECENT_KEY, []);
  recent.push(q);
  save(RECENT_KEY, recent.slice(-5));

  const acc = load<Record<string, ContinentAcc>>(CONT_KEY, {});
  const c = acc[q.continent] ?? { correct: 0, total: 0 };
  c.total += 1;
  if (q.correct) c.correct += 1;
  acc[q.continent] = c;
  save(CONT_KEY, acc);
}

export function recentQuestions(): RecentQuestion[] {
  return load<RecentQuestion[]>(RECENT_KEY, []);
}

export function continentAccuracy(): Record<string, ContinentAcc> {
  return load<Record<string, ContinentAcc>>(CONT_KEY, {});
}

// Continent le plus faible (≥ 3 tentatives), par précision la plus basse.
export function weakestContinent(): { continent: string; rate: number } | null {
  const acc = continentAccuracy();
  let worst: { continent: string; rate: number } | null = null;
  for (const [continent, a] of Object.entries(acc)) {
    if (a.total < 3) continue;
    const rate = a.correct / a.total;
    if (!worst || rate < worst.rate) worst = { continent, rate };
  }
  return worst;
}

export function resetAtlasContext() {
  try { localStorage.removeItem(RECENT_KEY); localStorage.removeItem(CONT_KEY); } catch {}
}
