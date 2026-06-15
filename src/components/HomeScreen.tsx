import { motion } from 'framer-motion';
import { Globe2, Play, Zap, ChevronRight } from 'lucide-react';
import { PlayerStats, Screen, XP_LEVELS } from '../types';
import { QuestItem } from '../hooks/useProgress';
import { PASS_LEVELS, passThreshold, passLevelForPoints, FREE_TRACK } from '../data/battlePass';
import { Translations, continentLabel } from '../i18n/translations';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  stats: PlayerStats;
  streak: number;
  freezes: number;
  maxFreezes: number;
  freezeCost: number;
  onBuyFreeze: () => void;
  quests: QuestItem[];
  passPoints: number;
  onNavigate: (screen: Screen) => void;
}

// Libellé court de la prochaine récompense du Passe (aperçu accueil)
function nextRewardLabel(t: Translations): (level: number) => { emoji: string; label: string } {
  return (level: number) => {
    const r = FREE_TRACK[Math.min(level, PASS_LEVELS) - 1];
    switch (r.type) {
      case 'xp': return { emoji: '⚡', label: `+${r.amount} XP` };
      case 'freeze': return { emoji: '❄️', label: t.reward_freeze };
      case 'badge': return { emoji: r.id === 'pass_gold' ? '🥇' : r.id === 'pass_silver' ? '🥈' : '🥉', label: t.reward_badge };
      default: return { emoji: '🎁', label: t.reward_badge };
    }
  };
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

export default function HomeScreen({ stats, streak, freezes, maxFreezes, freezeCost, onBuyFreeze, quests, passPoints, onNavigate }: Props) {
  const { t } = useLanguage();
  const currentLevel = XP_LEVELS.find(l => l.level === stats.level) || XP_LEVELS[0];
  const nextLevel = XP_LEVELS.find(l => l.level === stats.level + 1);
  const xpProgress = nextLevel
    ? ((stats.xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100
    : 100;

  // Aperçu Passe de Combat : niveau atteint + progression vers le suivant
  const passLevel = passLevelForPoints(passPoints);
  const passBase = passThreshold(passLevel);
  const passNextCost = passThreshold(passLevel + 1) - passBase;
  const passInLevel = passPoints - passBase;
  const passPct = passLevel >= PASS_LEVELS ? 100 : Math.min(100, (passInLevel / passNextCost) * 100);
  const reward = nextRewardLabel(t)(passLevel + 1);

  return (
    // px-4 (16px) + pb généreux : la BottomNav (auto-cachante) ne masque rien
    <div className="h-dvh overflow-y-auto w-full max-w-[480px] mx-auto flex flex-col px-4 pt-16 pb-28">

      {/* ——— 1. Header : logo + titre + niveau XP ——— */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-3"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe2 className="w-9 h-9 text-indigo-400 spin-slow" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight leading-tight">
          {t.home_title}
        </h1>
        <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 tracking-tight -mt-1 leading-tight">
          COUNTRY
        </h1>

        {stats.name && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {stats.level}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-white font-semibold text-sm truncate">{stats.name}</p>
                <p className="text-yellow-400 font-bold text-xs flex items-center gap-1 shrink-0">
                  <Zap className="w-3 h-3" /> {stats.xp} XP
                </p>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* ——— 2. Action : JOUER ——— */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-5"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => stats.name ? onNavigate('mode-select') : onNavigate('name-entry')}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3 transition-all"
        >
          <Play className="w-6 h-6" fill="currentColor" />
          {t.play_now}
        </motion.button>

      </motion.section>

      {/* ——— 3. Progression : streak + quêtes en cards horizontales ——— */}
      {stats.totalGames > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-5 -mx-4"
        >
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2 px-4">
            🎯 {t.daily_quests}
          </p>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory [scrollbar-width:none]">
            {/* Card streak */}
            <div className="snap-start shrink-0 w-[150px] bg-gradient-to-b from-orange-500/15 to-red-500/5 border border-orange-500/25 rounded-2xl p-3.5 flex flex-col">
              <motion.span
                animate={streak > 0 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="text-2xl select-none w-fit"
              >
                🔥
              </motion.span>
              <p className="text-white font-black text-2xl leading-tight mt-1">{streak}</p>
              <p className="text-orange-300/80 text-[10px] uppercase tracking-wider">{t.day_streak}</p>
              <div className="mt-auto pt-2 flex items-center justify-between gap-1">
                <span className="text-blue-200 text-xs font-semibold" title={t.streak_freezes}>❄️ ×{freezes}</span>
                {freezes < maxFreezes && (
                  <button
                    onClick={onBuyFreeze}
                    disabled={stats.xp < freezeCost}
                    className="px-1.5 py-1 rounded-lg text-[9px] font-bold bg-blue-500/15 border border-blue-400/30 text-blue-200 disabled:opacity-35"
                  >
                    {t.buy_freeze}
                  </button>
                )}
              </div>
            </div>

            {/* Cards quêtes */}
            {quests.map(q => (
              <div
                key={q.id + (q.premium ? '-p' : '')}
                className={`snap-start shrink-0 w-[170px] rounded-2xl p-3.5 border flex flex-col ${
                  q.premium
                    ? 'bg-gradient-to-b from-yellow-500/15 to-amber-600/5 border-yellow-500/30'
                    : 'bg-white/5 border-white/10'
                } ${q.done ? 'opacity-60' : ''}`}
              >
                <span className="text-2xl select-none">{q.premium ? '👑' : QUEST_EMOJI[q.id]}</span>
                <p className={`text-[12px] leading-snug mt-1 line-clamp-2 ${q.premium ? 'text-yellow-100' : 'text-slate-200'}`}>
                  {questLabel(q, t)}
                </p>
                <div className="mt-auto pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold ${q.done ? 'text-emerald-400' : q.premium ? 'text-yellow-400/80' : 'text-slate-400'}`}>
                      {q.done ? '✓' : `${q.progress}/${q.target}`}
                    </span>
                    <span className={`text-[10px] font-bold ${q.premium ? 'text-yellow-300' : 'text-indigo-300'}`}>
                      +{q.reward ?? 30} XP
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        q.done ? 'bg-emerald-500' : q.premium ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ——— 4. Stats rapides ——— */}
      {stats.totalGames > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { value: stats.totalGames, label: t.games_short, color: 'text-white' },
            { value: stats.bestScore, label: t.best_short, color: 'text-yellow-400' },
            {
              value: `${stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0}%`,
              label: t.accuracy_short,
              color: 'text-emerald-400',
            },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl py-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.section>
      )}

      {/* ——— 5. Aperçu du Passe de Combat (remplit le bas) ——— */}
      {stats.totalGames > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('premium')}
          className="mt-5 w-full text-left bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-indigo-500/25 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-bold text-sm flex items-center gap-2">
              💎 {t.battle_pass}
            </span>
            <span className="text-cyan-300 text-xs font-bold flex items-center gap-1">
              {t.level_title} {passLevel}/{PASS_LEVELS} <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${passPct}%` }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              💠 {passPoints} {t.pass_points}
            </span>
            {passLevel < PASS_LEVELS && (
              <span className="text-[11px] text-slate-300 flex items-center gap-1">
                {t.pass_next_reward} <span className="select-none">{reward.emoji}</span> {reward.label}
              </span>
            )}
          </div>
        </motion.button>
      )}

      {/* La barre de navigation fixe est rendue par App (BottomNav) */}
    </div>
  );
}
