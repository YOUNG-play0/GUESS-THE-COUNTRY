// Passe de Combat : 30 niveaux, deux voies parallèles (gratuite / premium).
// Les niveaux se débloquent en accumulant des Points de Passe (PP), gagnés
// en jouant, en accomplissant des quêtes et en terminant le défi du jour.

export const PASS_LEVELS = 30;

// Gains de PP
export const PP_PER_CORRECT = 1;
export const PP_PER_GAME = 5;
export const PP_PER_QUEST = 20;
export const PP_DAILY_BONUS = 30;

// Coût du niveau n : 30 + 5n PP (total ≈ 3 225 PP pour les 30 niveaux)
export function passThreshold(level: number): number {
  let total = 0;
  for (let n = 1; n <= level; n++) total += 30 + 5 * n;
  return total;
}

export function passLevelForPoints(pp: number): number {
  let level = 0;
  while (level < PASS_LEVELS && pp >= passThreshold(level + 1)) level++;
  return level;
}

export type PassReward =
  | { type: 'xp'; amount: number }
  | { type: 'freeze' }
  | { type: 'badge'; id: string }
  | { type: 'theme'; id: string }
  | { type: 'title'; title: string }
  | { type: 'frame'; id: string };

// Voie GRATUITE — XP bonus, gels de streak (niv. 5/15/25), badges (10/20/30)
function freeReward(level: number): PassReward {
  if (level === 10) return { type: 'badge', id: 'pass_bronze' };
  if (level === 20) return { type: 'badge', id: 'pass_silver' };
  if (level === 30) return { type: 'badge', id: 'pass_gold' };
  if (level % 5 === 0) return { type: 'freeze' };
  return { type: 'xp', amount: 25 + level * 5 };
}

// Voie PREMIUM 👑 — thèmes, titres exclusifs, cadres dorés, gros XP
function premiumReward(level: number): PassReward {
  if (level === 4) return { type: 'theme', id: 'sunset' };
  if (level === 12) return { type: 'theme', id: 'jungle' };
  if (level === 22) return { type: 'theme', id: 'ocean' };
  if (level === 7) return { type: 'title', title: 'Pionnier' };
  if (level === 14) return { type: 'title', title: 'Conquérant' };
  if (level === 21) return { type: 'title', title: 'Visionnaire' };
  if (level === 28) return { type: 'title', title: 'Immortel' };
  if (level === 10) return { type: 'frame', id: 'gold' };
  if (level === 30) return { type: 'frame', id: 'royal' };
  return { type: 'xp', amount: 50 + level * 8 };
}

export const FREE_TRACK: PassReward[] = Array.from({ length: PASS_LEVELS }, (_, i) => freeReward(i + 1));
export const PREMIUM_TRACK: PassReward[] = Array.from({ length: PASS_LEVELS }, (_, i) => premiumReward(i + 1));
