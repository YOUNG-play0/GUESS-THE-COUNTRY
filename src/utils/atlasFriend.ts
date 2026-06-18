// ATLAS, vrai ami virtuel : amitié persistante, mémoire de conversation,
// dernière visite (pour les messages proactifs sur l'accueil).
import { relationInfo, RelationInfo } from '../data/atlasRelation';
import { countries } from '../data/countries';

const FRIEND_KEY = 'gtc_atlas_friend';
const CHAT_KEY = 'gtc_atlas_chat_history';
const SEEN_KEY = 'gtc_atlas_lastseen';
const ANECDOTE_KEY = 'gtc_atlas_anecdote';

export interface FriendState {
  friendship: number; // 0..100
  duelMentions: number;
}

const DEFAULT: FriendState = { friendship: 0, duelMentions: 0 };

function load(): FriendState {
  try {
    const raw = localStorage.getItem(FRIEND_KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT };
}
function save(s: FriendState) {
  try { localStorage.setItem(FRIEND_KEY, JSON.stringify(s)); } catch {}
}

export function getFriendship(): number {
  return load().friendship;
}

export function getRelation(): RelationInfo {
  return relationInfo(load().friendship);
}

// Gagne des points d'amitié (en jouant). Retourne le nouveau total et si on
// vient de franchir un palier.
export function addFriendship(amount: number): { friendship: number; leveledUp: boolean } {
  const s = load();
  const before = relationInfo(s.friendship).index;
  s.friendship = Math.max(0, Math.min(100, s.friendship + amount));
  save(s);
  const after = relationInfo(s.friendship).index;
  return { friendship: s.friendship, leveledUp: after > before };
}

// ——— Mémoire de conversation persistante (50 derniers échanges) ———
export interface StoredChatMessage { role: 'user' | 'assistant'; content: string }

export function loadChatHistory(): StoredChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function appendChat(role: 'user' | 'assistant', content: string) {
  const h = loadChatHistory();
  h.push({ role, content });
  const trimmed = h.slice(-50); // ATLAS se souvient des 50 derniers messages
  try { localStorage.setItem(CHAT_KEY, JSON.stringify(trimmed)); } catch {}
}

// ——— Dernière visite (messages proactifs) ———
export function markSeen() {
  try { localStorage.setItem(SEEN_KEY, String(Date.now())); } catch {}
}
export function hoursSinceSeen(): number {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return 0;
    return (Date.now() - Number(raw)) / 3600000;
  } catch { return 0; }
}

// Anecdote géo du jour (déterministe par date, stable toute la journée)
const ANECDOTES = [
  "Tu savais que la Russie touche 14 pays ? Record du monde. Je les ai tous traversés, évidemment.",
  "Le Canada a plus de lacs que tout le reste du monde réuni. J'y ai pêché, une fois.",
  "L'Australie est plus large que la Lune. Véridique. Je l'ai survolée six fois.",
  "Le Vatican : 0,44 km². J'en ai fait le tour à pied en dix minutes, montre en main.",
  "L'Indonésie compte plus de 17 000 îles. J'en ai visité… disons beaucoup.",
  "Le point le plus sec de la Terre est au Chili, dans l'Atacama. J'y ai eu très soif.",
  "Istanbul est à cheval sur deux continents. J'ai pris mon café en Europe, mon thé en Asie.",
  "Le Nil ou l'Amazone, le plus long ? On se bat encore. Moi j'ai un avis tranché, forcément.",
  "Le Japon a près de 7 000 îles. C'est mon pays préféré, j'y suis allé trois fois.",
  "La Bolivie a deux capitales. Même moi ça m'a perturbé. Une fois. Brièvement.",
];

export function anecdoteOfTheDay(): string {
  const today = new Date();
  const key = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  try {
    const cached = localStorage.getItem(ANECDOTE_KEY);
    if (cached) {
      const { k, i } = JSON.parse(cached);
      if (k === key) return ANECDOTES[i];
    }
  } catch {}
  const i = Math.abs(hashStr(key)) % ANECDOTES.length;
  try { localStorage.setItem(ANECDOTE_KEY, JSON.stringify({ k: key, i })); } catch {}
  return ANECDOTES[i];
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

// Message proactif affiché sur l'accueil selon le contexte.
export interface ProactiveCtx {
  level: number;
  recentLevelGain?: number; // niveaux gagnés récemment
  totalGames: number;
}

export function proactiveMessage(ctx: ProactiveCtx): string {
  const hours = hoursSinceSeen();

  // 1) Absence > 24h : il s'inquiète
  if (hours >= 24 && ctx.totalGames > 0) {
    const back = [
      "Hé, où t'étais passé ? J'allais m'inquiéter 😅",
      "De retour ! Le monde n'attend que toi. Et moi un peu aussi.",
      "Ah, te revoilà ! J'ai failli partir explorer sans toi.",
    ];
    return back[Math.floor(Math.random() * back.length)];
  }

  // 2) Progression notable
  if (ctx.recentLevelGain && ctx.recentLevelGain >= 2) {
    return `T'as monté ${ctx.recentLevelGain} niveaux récemment, respect 👏`;
  }

  // 3) Un challenge (capitale d'un pays au hasard, souvent un obscur)
  if (ctx.totalGames > 0 && Math.random() < 0.5) {
    const pool = countries.filter(c => c.difficulty === 'expert' || c.difficulty === 'legendary');
    const c = pool[Math.floor(Math.random() * pool.length)];
    return `Je parie que tu connais pas la capitale ${prep(c.nameFr)} ${c.nameFr}…`;
  }

  // 4) Sinon : anecdote du jour
  return anecdoteOfTheDay();
}

function prep(name: string): string {
  // petit raccourci grammatical "du/de la/de"
  if (/^[aeéiouAEÉIOU]/.test(name)) return "d'";
  return 'du';
}

export function resetFriend() {
  try {
    localStorage.removeItem(FRIEND_KEY);
    localStorage.removeItem(CHAT_KEY);
    localStorage.removeItem(SEEN_KEY);
    localStorage.removeItem(ANECDOTE_KEY);
  } catch {}
}
