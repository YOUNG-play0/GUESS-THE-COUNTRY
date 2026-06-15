import { Translations, continentLabel } from '../i18n/translations';
import { countries } from './countries';
import { GameSummary } from '../hooks/useProgress';

// Succès débloquables. Les conditions sont évaluées en fin de partie sur
// un contexte déjà mis à jour (stats de la partie incluses).

export interface BadgeCtx {
  totalGames: number;
  bestCombo: number;
  bestScore: number;
  level: number;
  streak: number;
  passport: string[];
  lastGame: GameSummary;
}

export interface BadgeDef {
  id: string;
  emoji: string;
  continent?: string;
  check: (c: BadgeCtx) => boolean;
}

function continentComplete(passport: string[], continent: string): boolean {
  const owned = new Set(passport);
  return countries.filter(c => c.continent === continent).every(c => owned.has(c.name));
}

export const BADGES: BadgeDef[] = [
  { id: 'perfect', emoji: '💯', check: c => c.lastGame.questionsAnswered >= 10 && c.lastGame.correctAnswers === c.lastGame.questionsAnswered },
  { id: 'combo10', emoji: '🔥', check: c => c.bestCombo >= 10 },
  { id: 'games10', emoji: '🎮', check: c => c.totalGames >= 10 },
  { id: 'games100', emoji: '🏆', check: c => c.totalGames >= 100 },
  { id: 'score500', emoji: '⚡', check: c => c.bestScore >= 500 },
  { id: 'streak7', emoji: '📅', check: c => c.streak >= 7 },
  { id: 'passport25', emoji: '🛂', check: c => c.passport.length >= 25 },
  { id: 'passport100', emoji: '🌍', check: c => c.passport.length >= 100 },
  { id: 'level5', emoji: '🗺️', check: c => c.level >= 5 },
  // Récompenses du Passe de Combat (jamais débloquées par condition,
  // uniquement accordées par la voie gratuite du Passe)
  { id: 'pass_bronze', emoji: '🥉', check: () => false },
  { id: 'pass_silver', emoji: '🥈', check: () => false },
  { id: 'pass_gold', emoji: '🥇', check: () => false },
  ...['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'].map(continent => ({
    id: `master_${continent.replace(' ', '_')}`,
    emoji: '👑',
    continent,
    check: (c: BadgeCtx) => continentComplete(c.passport, continent),
  })),
];

export function badgeLabel(badge: BadgeDef, t: Translations): { name: string; desc: string } {
  if (badge.continent) {
    const cont = continentLabel(badge.continent, t);
    return {
      name: t.badge_master_name.replace('{continent}', cont),
      desc: t.badge_master_desc.replace('{continent}', cont),
    };
  }
  switch (badge.id) {
    case 'perfect': return { name: t.badge_perfect_name, desc: t.badge_perfect_desc };
    case 'combo10': return { name: t.badge_combo10_name, desc: t.badge_combo10_desc };
    case 'games10': return { name: t.badge_games10_name, desc: t.badge_games10_desc };
    case 'games100': return { name: t.badge_games100_name, desc: t.badge_games100_desc };
    case 'score500': return { name: t.badge_score500_name, desc: t.badge_score500_desc };
    case 'streak7': return { name: t.badge_streak7_name, desc: t.badge_streak7_desc };
    case 'passport25': return { name: t.badge_passport25_name, desc: t.badge_passport25_desc };
    case 'passport100': return { name: t.badge_passport100_name, desc: t.badge_passport100_desc };
    case 'level5': return { name: t.badge_level5_name, desc: t.badge_level5_desc };
    case 'pass_bronze': return { name: t.badge_pass_bronze_name, desc: t.badge_pass_desc };
    case 'pass_silver': return { name: t.badge_pass_silver_name, desc: t.badge_pass_desc };
    case 'pass_gold': return { name: t.badge_pass_gold_name, desc: t.badge_pass_desc };
    default: return { name: badge.id, desc: '' };
  }
}
