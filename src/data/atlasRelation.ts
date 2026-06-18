// Système de relation avec ATLAS : jauge d'amitié 0 → 100, 6 paliers.
// Le comportement (ton) d'ATLAS dépend du palier.

export type RelationTier = 'stranger' | 'rival' | 'friendlyRival' | 'friend' | 'bestFriend' | 'legend';

export interface RelationLevel {
  tier: RelationTier;
  min: number;
  emoji: string;
}

export const RELATION_LEVELS: RelationLevel[] = [
  { tier: 'stranger', min: 0, emoji: '🤝' },
  { tier: 'rival', min: 15, emoji: '⚔️' },
  { tier: 'friendlyRival', min: 35, emoji: '😏' },
  { tier: 'friend', min: 55, emoji: '😄' },
  { tier: 'bestFriend', min: 80, emoji: '🤜🤛' },
  { tier: 'legend', min: 100, emoji: '👑' },
];

export interface RelationInfo {
  tier: RelationTier;
  emoji: string;
  index: number;
  /** progression vers le palier suivant en % (100 si max) */
  pct: number;
  nextMin: number | null;
}

export function relationInfo(points: number): RelationInfo {
  const p = Math.max(0, Math.min(100, points));
  let idx = 0;
  for (let i = 0; i < RELATION_LEVELS.length; i++) {
    if (p >= RELATION_LEVELS[i].min) idx = i;
  }
  const cur = RELATION_LEVELS[idx];
  const next = RELATION_LEVELS[idx + 1] ?? null;
  const pct = next ? Math.round(((p - cur.min) / (next.min - cur.min)) * 100) : 100;
  return { tier: cur.tier, emoji: cur.emoji, index: idx, pct, nextMin: next ? next.min : null };
}

// Le ton d'ATLAS injecté dans le prompt système selon le palier
export const RELATION_TONE: Record<RelationTier, string> = {
  stranger: "Tu connais à peine ce joueur : reste poli, un peu formel et distant, vouvoie-le presque. Tu te montres surtout fier de toi.",
  rival: "Tu vois ce joueur comme un rival : sois taquin et compétitif, cherche un peu la rivalité avec le sourire.",
  friendlyRival: "Vous êtes des rivaux amicaux : tutoiement complice, vannes affectueuses, vous vous chambrez mais vous vous appréciez.",
  friend: "C'est ton ami maintenant : sois chaleureux, encourageant, tu lui fais confiance et tu partages tes anecdotes de voyage.",
  bestFriend: "C'est ton meilleur ami : taquine-le beaucoup, sois très complice, et confie-lui parfois tes 'secrets' (tes vraies faiblesses en géo).",
  legend: "Vous êtes une légende à deux : complicité totale, fierté partagée, tu le traites comme un partenaire d'aventure d'égal à égal.",
};
