// Client de conversation libre avec ATLAS (Premium).
// Limite : 50 appels/jour par session, comptés en localStorage.
// Appelle la fonction serverless /api/chat (Groq). Si l'endpoint n'existe
// pas (ex. GitHub Pages sans backend), on lève une erreur explicite.

import { todayKey } from '../hooks/useProgress';

export const DAILY_LIMIT = 50;
const QUOTA_KEY = 'gtc_atlas_chat_quota';

export interface ChatContext {
  playerLevel?: number;
  atlasLevel?: number;
  lastQuestion?: string;
  lastResult?: string;
  streak?: number;
  continentStats?: Record<string, number>;
  /** Ton à adopter selon le palier d'amitié */
  relationTone?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Quota { date: string; count: number; }

function loadQuota(): Quota {
  try {
    const raw = localStorage.getItem(QUOTA_KEY);
    if (raw) {
      const q = JSON.parse(raw) as Quota;
      if (q.date === todayKey()) return q;
    }
  } catch {}
  return { date: todayKey(), count: 0 };
}

export function remainingMessages(): number {
  return Math.max(0, DAILY_LIMIT - loadQuota().count);
}

function consume() {
  const q = loadQuota();
  const next: Quota = { date: todayKey(), count: q.count + 1 };
  try { localStorage.setItem(QUOTA_KEY, JSON.stringify(next)); } catch {}
}

export class AtlasChatError extends Error {}

export async function sendAtlasMessage(message: string, context: ChatContext, history: ChatMessage[]): Promise<string> {
  if (remainingMessages() <= 0) {
    throw new AtlasChatError('limit');
  }
  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, history }),
    });
  } catch {
    throw new AtlasChatError('network');
  }
  if (!res.ok) {
    throw new AtlasChatError(res.status === 404 ? 'unavailable' : 'server');
  }
  const data = await res.json().catch(() => ({}));
  consume();
  return (data as { reply?: string }).reply || '...';
}
