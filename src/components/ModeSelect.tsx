import { motion } from 'framer-motion';
import { Gamepad2, Heart, Timer, Map, Compass, ArrowLeft, Lock, ChevronRight, Crown } from 'lucide-react';
import { useState } from 'react';
import { GameMode, Difficulty, PlayerStats } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  stats: PlayerStats;
  /** Mode Explorateur accessible (Passe du Savoir ou Pack Continent) */
  explorerUnlocked: boolean;
  onStart: (mode: GameMode, difficulty: Difficulty) => void;
  onPremium: () => void;
  onBack: () => void;
}

export default function ModeSelect({ stats, explorerUnlocked, onStart, onPremium, onBack }: Props) {
  const { t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const modes = [
    { id: 'classic' as GameMode, name: t.classic_mode, desc: t.classic_desc, icon: Gamepad2, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/25' },
    { id: 'survival' as GameMode, name: t.survival_mode, desc: t.survival_desc, icon: Heart, color: 'from-red-500 to-rose-600', shadow: 'shadow-red-500/25' },
    { id: 'chrono' as GameMode, name: t.chrono_mode, desc: t.chrono_desc, icon: Timer, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/25' },
    { id: 'map' as GameMode, name: t.map_mode, desc: t.map_desc, icon: Map, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/25' },
    { id: 'explorer' as GameMode, name: t.explorer_mode, desc: t.explorer_desc, icon: Compass, color: 'from-yellow-500 to-amber-600', shadow: 'shadow-yellow-500/25', premium: true },
  ];

  const difficulties: { id: Difficulty; name: string; emoji: string; color: string; minLevel: number }[] = [
    { id: 'easy', name: t.easy, emoji: '🟢', color: 'border-emerald-500 bg-emerald-500/10', minLevel: 1 },
    { id: 'medium', name: t.medium, emoji: '🟡', color: 'border-yellow-500 bg-yellow-500/10', minLevel: 2 },
    { id: 'hard', name: t.hard, emoji: '🔴', color: 'border-red-500 bg-red-500/10', minLevel: 4 },
    { id: 'expert', name: t.expert, emoji: '💀', color: 'border-purple-500 bg-purple-500/10', minLevel: 7 },
  ];

  if (selectedMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <button onClick={() => setSelectedMode(null)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors py-2">
            <ArrowLeft className="w-4 h-4" /> {t.back_to_modes}
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">{t.select_difficulty}</h2>
          <p className="text-slate-400 text-sm mb-6">{t.diff_desc}</p>
          <div className="space-y-3">
            {difficulties.map((diff, i) => {
              const locked = !stats.unlockedDifficulties.includes(diff.id);
              return (
                <motion.button
                  key={diff.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileTap={!locked ? { scale: 0.97 } : {}}
                  onClick={() => !locked && onStart(selectedMode, diff.id)}
                  disabled={locked}
                  className={`w-full p-4 rounded-2xl border ${diff.color} flex items-center gap-4 transition-all ${locked ? 'opacity-40 cursor-not-allowed' : 'hover:brightness-110 active:brightness-90'}`}
                >
                  <span className="text-2xl select-none">{diff.emoji}</span>
                  <div className="flex-1 text-left">
                    <p className="text-white font-bold">{diff.name}</p>
                    {locked && (
                      <p className="text-slate-400 text-xs flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {t.unlock_at_level} {diff.minLevel}
                      </p>
                    )}
                  </div>
                  {!locked && <ChevronRight className="w-5 h-5 text-white/50 shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors py-2">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>
        <h2 className="text-2xl font-bold text-white mb-1">{t.choose_mode}</h2>
        <p className="text-slate-400 text-sm mb-6">{t.mode_desc}</p>
        <div className="space-y-3">
          {modes.map((mode, i) => {
            const Icon = mode.icon;
            const lockedPremium = mode.premium && !explorerUnlocked;
            return (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => lockedPremium ? onPremium() : setSelectedMode(mode.id)}
                className={`w-full p-4 bg-gradient-to-r ${mode.color} rounded-2xl shadow-lg ${mode.shadow} flex items-center gap-4 transition-all hover:brightness-110 active:brightness-90 ${lockedPremium ? 'opacity-80 saturate-50' : ''}`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white font-bold text-lg flex items-center gap-2">
                    {mode.name}
                    {mode.premium && <Crown className="w-4 h-4 text-yellow-200 shrink-0" />}
                  </p>
                  <p className="text-white/70 text-xs truncate">{lockedPremium ? t.premium_required : mode.desc}</p>
                </div>
                {lockedPremium ? <Lock className="w-5 h-5 text-white/70 shrink-0" /> : <ChevronRight className="w-5 h-5 text-white/50 shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
