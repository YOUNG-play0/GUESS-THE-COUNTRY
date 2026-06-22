// Reset de saison : à l'arrivée d'ATLAS (saison 2), les joueurs de
// l'ancienne version repartent à zéro une seule fois.
import { resetFriend } from './atlasFriend';

export const CURRENT_SEASON = 2;
const SEASON_KEY = 'gtc_season';

function storedSeason(): number {
  try { return Number(localStorage.getItem(SEASON_KEY) || '0'); } catch { return 0; }
}

function hasOldData(): boolean {
  try {
    const raw = localStorage.getItem('gtc_stats');
    if (!raw) return false;
    const s = JSON.parse(raw);
    return (s.totalGames ?? 0) > 0 || (s.xp ?? 0) > 0;
  } catch { return false; }
}

// true → il faut montrer l'écran "Nouvelle saison" (ancien joueur, pas encore migré)
export function needsSeasonReset(): boolean {
  if (storedSeason() >= CURRENT_SEASON) return false;
  return hasOldData();
}

// Marque la saison comme courante sans rien effacer (nouveaux joueurs)
export function markSeasonCurrent() {
  try { localStorage.setItem(SEASON_KEY, String(CURRENT_SEASON)); } catch {}
}

// Efface toute la progression (stats, progression, difficulté, ATLAS) puis
// marque la saison. Garde les préférences (langue, son, voix) et l'abonnement.
export function performSeasonReset() {
  const keep = ['gtc_language', 'gtc_sound', 'gtc_atlas_voice', 'gtc_theme', 'gtc_premium'];
  const toRemove = [
    'gtc_stats', 'gtc_progress', 'gtc_adaptive',
    'gtc_duel_history', 'gtc_atlas_chat_quota',
    'gtc_atlas_recent', 'gtc_atlas_cont_acc',
  ];
  try {
    for (const k of toRemove) localStorage.removeItem(k);
    resetFriend();
    void keep; // (les clés conservées ne sont simplement pas supprimées)
    localStorage.setItem(SEASON_KEY, String(CURRENT_SEASON));
  } catch {}
}
