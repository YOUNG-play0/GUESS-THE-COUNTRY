import { motion } from 'framer-motion';
import { ArrowLeft, Target, Flame, Gamepad2, Trophy, TrendingUp, Globe2, Zap, Crown, Lock } from 'lucide-react';
import { PlayerStats } from '../types';
import { countries } from '../data/countries';
import { continentLabel } from '../i18n/translations';
import { useLanguage } from '../contexts/LanguageContext';

const CONTINENT_ORDER = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];

interface Props {
  stats: PlayerStats;
  /** Bonnes réponses cumulées par continent */
  continentStats: Record<string, number>;
  passport: string[];
  isPremium: boolean;
  onPremium: () => void;
  onBack: () => void;
}

export default function StatsScreen({ stats, continentStats, passport, isPremium, onPremium, onBack }: Props) {
  const { t } = useLanguage();
  const accuracy = stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0;
  const avgScore = stats.totalGames > 0 ? Math.round(stats.totalScore / stats.totalGames) : 0;

  const statCards = [
    { icon: Gamepad2, label: t.games_played, value: stats.totalGames, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Trophy, label: t.best_short, value: stats.bestScore, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Target, label: t.accuracy, value: `${accuracy}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Flame, label: t.best_combo, value: stats.bestCombo, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { icon: TrendingUp, label: t.avg_score, value: avgScore, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Globe2, label: t.total_score, value: stats.totalScore, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { icon: Zap, label: t.total_xp, value: stats.xp, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Target, label: t.total_correct, value: `${stats.correctAnswers}/${stats.totalAnswers}`, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  ];

  const modeStats = [
    { mode: 'classic', label: t.classic_mode, games: stats.gamesPerMode.classic, emoji: '🎮' },
    { mode: 'survival', label: t.survival_mode, games: stats.gamesPerMode.survival, emoji: '❤️' },
    { mode: 'chrono', label: t.chrono_mode, games: stats.gamesPerMode.chrono, emoji: '⏱️' },
    { mode: 'map', label: t.map_mode, games: stats.gamesPerMode.map, emoji: '🗺️' },
    { mode: 'daily', label: t.daily_challenge, games: stats.gamesPerMode.daily ?? 0, emoji: '📅' },
    { mode: 'explorer', label: t.explorer_mode, games: stats.gamesPerMode.explorer ?? 0, emoji: '🧭' },
  ];

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors py-2">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">{t.statistics}</h2>
          <p className="text-slate-400 text-sm">{t.stats_desc}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-2`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-slate-500 text-xs">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
          <h3 className="text-white font-bold mb-3">{t.games_by_mode}</h3>
          <div className="space-y-3">
            {modeStats.map(ms => {
              const total = stats.totalGames || 1;
              const pct = Math.round((ms.games / total) * 100);
              return (
                <div key={ms.mode}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{ms.emoji} {ms.label}</span>
                    <span className="text-sm text-slate-400">{ms.games}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats détaillées par continent — Passe du Savoir */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" /> {t.continent_stats_title}
          </h3>
          {isPremium ? (
            <div className="space-y-3">
              {CONTINENT_ORDER.map(cont => {
                const total = countries.filter(c => c.continent === cont).length;
                const found = countries.filter(c => c.continent === cont && passport.includes(c.name)).length;
                const correct = continentStats[cont] ?? 0;
                return (
                  <div key={cont}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{continentLabel(cont, t)}</span>
                      <span className="text-xs text-slate-400">
                        🛂 {found}/{total} · ✅ {correct}
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(found / total) * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <button onClick={onPremium} className="w-full py-6 rounded-xl border border-dashed border-yellow-500/30 bg-yellow-500/5 flex flex-col items-center gap-2 hover:bg-yellow-500/10 transition-all">
              <Lock className="w-5 h-5 text-yellow-400/70" />
              <span className="text-yellow-200/80 text-xs font-semibold">{t.premium_required}</span>
            </button>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none" stroke="url(#accuracy-gradient)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${accuracy * 2.64} ${264 - accuracy * 2.64}`}
                initial={{ strokeDasharray: '0 264' }}
                animate={{ strokeDasharray: `${accuracy * 2.64} ${264 - accuracy * 2.64}` }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
              <defs>
                <linearGradient id="accuracy-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{accuracy}%</span>
              <span className="text-xs text-slate-400">{t.accuracy}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
