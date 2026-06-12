import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Star, Lock, Check, Zap, Medal, Palette } from 'lucide-react';
import { PlayerStats, XP_LEVELS } from '../types';
import { BADGES, badgeLabel } from '../data/badges';
import { THEMES, DEFAULT_THEME } from '../utils/themes';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  stats: PlayerStats;
  badges: string[];
  /** Passe du Savoir : badges dorés + thèmes visuels */
  isPremium: boolean;
  theme: string;
  onSetTheme: (id: string) => void;
  onPremium: () => void;
  onBack: () => void;
}

export default function ProfileScreen({ stats, badges, isPremium, theme, onSetTheme, onPremium, onBack }: Props) {
  const { t } = useLanguage();
  const currentLevel = XP_LEVELS.find(l => l.level === stats.level) || XP_LEVELS[0];
  const nextLevel = XP_LEVELS.find(l => l.level === stats.level + 1);
  const xpProgress = nextLevel ? ((stats.xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100 : 100;


  return (
    <div className="min-h-screen px-4 pt-16 pb-36">
      <div className="w-full max-w-[480px] mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors py-2">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-6 mb-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/25 relative">
            <span className="text-4xl font-black text-white">{stats.level}</span>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="w-4 h-4 text-white" fill="currentColor" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-white">{stats.name || 'Player'}</h2>
          <p className="text-indigo-300 font-medium">{currentLevel.title}</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-400 flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" /> {stats.xp} XP</span>
              {nextLevel && <span className="text-slate-500">{nextLevel.xp} XP</span>}
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1, delay: 0.3 }} />
            </div>
            {nextLevel && <p className="text-slate-500 text-xs mt-1">{nextLevel.xp - stats.xp} XP to {t.level_title} {nextLevel.level}</p>}
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" /> {t.level_title} {t.progress}
          </h3>
          <div className="space-y-3">
            {XP_LEVELS.map((level, i) => {
              const isUnlocked = stats.level >= level.level;
              const isCurrent = stats.level === level.level;
              return (
                <motion.div key={level.level} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                    isCurrent ? 'bg-indigo-500/20 border-indigo-400/30'
                    : isUnlocked ? 'bg-white/[0.03] border-white/10'
                    : 'bg-white/[0.01] border-white/5 opacity-40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${isUnlocked ? 'from-indigo-500 to-purple-600' : 'from-slate-600 to-slate-700'} flex items-center justify-center shrink-0`}>
                    {isUnlocked ? <span className="font-black text-white">{level.level}</span> : <Lock className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isCurrent ? 'text-indigo-300' : 'text-white'}`}>{level.title}</p>
                    <p className="text-slate-500 text-xs">{level.xp} XP</p>
                  </div>
                  {isCurrent && <Check className="w-5 h-5 text-indigo-400 shrink-0" />}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Thèmes visuels — Passe du Savoir */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-400" /> {t.themes_title}
            {!isPremium && <Lock className="w-4 h-4 text-yellow-400/70 ml-auto" />}
          </h3>
          <div className="grid grid-cols-4 gap-2.5">
            {THEMES.map(th => {
              const active = (isPremium ? theme : DEFAULT_THEME) === th.id;
              const locked = !isPremium && th.id !== DEFAULT_THEME;
              return (
                <button
                  key={th.id}
                  onClick={() => locked ? onPremium() : onSetTheme(th.id)}
                  className={`rounded-2xl border p-3 flex flex-col items-center gap-1.5 transition-all ${
                    active ? 'border-indigo-400/60 bg-indigo-500/15' : 'border-white/10 bg-white/[0.03] hover:bg-white/10'
                  } ${locked ? 'opacity-50' : ''}`}
                >
                  <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${th.gradient} border border-white/20 flex items-center justify-center text-sm select-none`}>
                    {locked ? '👑' : th.emoji}
                  </span>
                  {active && <Check className="w-3.5 h-3.5 text-indigo-300" />}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Succès */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Medal className="w-5 h-5 text-yellow-400" /> {t.badges_title}
            <span className="ml-auto text-xs text-slate-400 font-semibold">{badges.length}/{BADGES.length}</span>
          </h3>
          <div className="grid grid-cols-3 gap-2.5">
            {BADGES.map(b => {
              const unlocked = badges.includes(b.id);
              const { name, desc } = badgeLabel(b, t);
              return (
                <div
                  key={b.id}
                  title={`${name} — ${desc}`}
                  className={`rounded-2xl border p-2.5 text-center ${
                    unlocked
                      ? isPremium
                        ? 'bg-gradient-to-b from-yellow-500/25 to-amber-600/10 border-yellow-400/50 shadow-lg shadow-yellow-500/10'
                        : 'bg-yellow-500/10 border-yellow-500/25'
                      : 'bg-white/[0.02] border-white/5 opacity-40'
                  }`}
                >
                  <span className={`text-2xl select-none ${unlocked ? '' : 'grayscale'}`} style={unlocked ? undefined : { filter: 'grayscale(1)' }}>
                    {unlocked ? b.emoji : '🔒'}
                  </span>
                  <p className={`mt-1 text-[10px] leading-tight font-semibold ${unlocked ? 'text-yellow-200' : 'text-slate-500'}`}>
                    {name}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
