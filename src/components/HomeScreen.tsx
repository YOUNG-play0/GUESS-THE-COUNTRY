import { motion } from 'framer-motion';
import { Globe2, BarChart3, User, Play, Zap, CalendarCheck } from 'lucide-react';
import { PlayerStats, Screen, XP_LEVELS } from '../types';
import { DailyState, QuestItem, QUEST_XP_REWARD } from '../hooks/useProgress';
import { Translations } from '../i18n/translations';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  stats: PlayerStats;
  streak: number;
  freezes: number;
  maxFreezes: number;
  freezeCost: number;
  onBuyFreeze: () => void;
  daily: DailyState | null;
  onPlayDaily: () => void;
  quests: QuestItem[];
  onNavigate: (screen: Screen) => void;
}

export function continentLabel(continent: string, t: Translations): string {
  switch (continent) {
    case 'Europe': return t.continent_europe;
    case 'Asia': return t.continent_asia;
    case 'Africa': return t.continent_africa;
    case 'North America': return t.continent_north_america;
    case 'South America': return t.continent_south_america;
    case 'Oceania': return t.continent_oceania;
    default: return continent;
  }
}

function questLabel(q: QuestItem, t: Translations): string {
  const n = String(q.target);
  switch (q.id) {
    case 'correct': return t.quest_correct.replace('{n}', n);
    case 'combo': return t.quest_combo.replace('{n}', n);
    case 'continent': return t.quest_continent.replace('{n}', n).replace('{continent}', continentLabel(q.continent ?? '', t));
    case 'games': return t.quest_games.replace('{n}', n);
    case 'score': return t.quest_score.replace('{n}', n);
    case 'flags': return t.quest_flags.replace('{n}', n);
  }
}

const QUEST_EMOJI: Record<QuestItem['id'], string> = {
  correct: '🎯', combo: '🔥', continent: '🌍', games: '🎮', score: '⚡', flags: '🚩',
};

export default function HomeScreen({ stats, streak, freezes, maxFreezes, freezeCost, onBuyFreeze, daily, onPlayDaily, quests, onNavigate }: Props) {
  const { t } = useLanguage();
  const currentLevel = XP_LEVELS.find(l => l.level === stats.level) || XP_LEVELS[0];
  const nextLevel = XP_LEVELS.find(l => l.level === stats.level + 1);
  const xpProgress = nextLevel
    ? ((stats.xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100
    : 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Globe2 className="w-12 h-12 text-indigo-400 spin-slow" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight leading-tight">
          {t.home_title}
        </h1>
        <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 tracking-tight -mt-1 leading-tight">
          COUNTRY
        </h1>
        <p className="text-slate-400 mt-2 text-xs sm:text-sm font-medium tracking-wider uppercase">
          {t.home_subtitle}
        </p>
      </motion.div>

      {/* Streak de jours consécutifs */}
      {stats.totalGames > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 w-full max-w-sm bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl px-5 py-3 flex items-center gap-3"
        >
          <motion.span
            animate={streak > 0 ? { scale: [1, 1.25, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="text-3xl select-none"
          >
            🔥
          </motion.span>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-xl leading-none">{streak}</p>
            <p className="text-orange-300/80 text-[11px] uppercase tracking-wider">{t.day_streak}</p>
          </div>
          <div className="text-right shrink-0 flex items-center gap-2">
            <span className="text-blue-200 text-sm font-semibold" title={t.streak_freezes}>
              ❄️ ×{freezes}
            </span>
            {freezes < maxFreezes && (
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={onBuyFreeze}
                disabled={stats.xp < freezeCost}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all bg-blue-500/15 border-blue-400/30 text-blue-200 hover:bg-blue-500/25 disabled:opacity-35"
              >
                {t.buy_freeze}
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Player Level Badge */}
      {stats.name && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {stats.level}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{stats.name}</p>
            <p className="text-indigo-300 text-xs">{currentLevel.title}</p>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-yellow-400 font-bold text-xs flex items-center gap-1">
              <Zap className="w-3 h-3" /> {stats.xp} XP
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm space-y-3"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => stats.name ? onNavigate('mode-select') : onNavigate('name-entry')}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:from-indigo-700 active:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3 transition-all"
        >
          <Play className="w-6 h-6" fill="currentColor" />
          {t.play_now}
        </motion.button>

        {/* Défi du jour : 5 questions identiques pour tous, 1 tentative */}
        {daily ? (
          <div className="w-full py-3.5 px-5 bg-white/5 border border-emerald-500/25 rounded-2xl flex items-center gap-3">
            <CalendarCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-sm">
                {t.daily_challenge} — {daily.correct}/{daily.total} ✅
              </p>
              <p className="text-slate-400 text-xs">{t.come_back_tomorrow}</p>
            </div>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onPlayDaily}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-3 transition-all"
          >
            <span className="text-2xl select-none">📅</span>
            <span className="flex-1 text-left">
              <span className="block font-bold text-sm">{t.daily_challenge}</span>
              <span className="block text-emerald-100/80 text-xs">{t.daily_desc}</span>
            </span>
          </motion.button>
        )}

        {/* Quêtes quotidiennes */}
        {stats.totalGames > 0 && (
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2.5">🎯 {t.daily_quests}</p>
            <div className="space-y-2.5">
              {quests.map(q => (
                <div key={q.id} className={q.done ? 'opacity-60' : ''}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[13px] text-slate-200 flex items-center gap-1.5 min-w-0">
                      <span className="select-none">{QUEST_EMOJI[q.id]}</span>
                      <span className="truncate">{questLabel(q, t)}</span>
                    </span>
                    <span className={`text-[11px] font-bold shrink-0 ${q.done ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {q.done ? `✓ +${QUEST_XP_REWARD} XP` : `${q.progress}/${q.target}`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${q.done ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('stats')}
            className="py-4 px-3 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 active:bg-white/15 text-white rounded-2xl flex flex-col items-center gap-2 transition-all"
          >
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-semibold">{t.stats}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('profile')}
            className="py-4 px-3 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 active:bg-white/15 text-white rounded-2xl flex flex-col items-center gap-2 transition-all"
          >
            <User className="w-6 h-6 text-blue-400" />
            <span className="text-xs font-semibold">{t.profile}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      {stats.totalGames > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex gap-6 text-center"
        >
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalGames}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.games_short}</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-2xl font-bold text-yellow-400">{stats.bestScore}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.best_short}</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-2xl font-bold text-emerald-400">
              {stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0}%
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.accuracy_short}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
