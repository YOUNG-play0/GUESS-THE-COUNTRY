import { motion } from 'framer-motion';
import { Gamepad2, Heart, Timer, Map, Compass, ArrowLeft, Lock, ChevronRight, Crown, TrendingUp } from 'lucide-react';
import { GameMode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  /** Mode Explorateur accessible (Passe du Savoir ou Pack Continent) */
  explorerUnlocked: boolean;
  onStart: (mode: GameMode) => void;
  onPremium: () => void;
  onBack: () => void;
}

// Plus de choix manuel de difficulté : elle est adaptative, calculée sur
// les 10 dernières réponses, et affichée en temps réel pendant la partie.
export default function ModeSelect({ explorerUnlocked, onStart, onPremium, onBack }: Props) {
  const { t } = useLanguage();

  const modes = [
    { id: 'classic' as GameMode, name: t.classic_mode, desc: t.classic_desc, icon: Gamepad2, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/25' },
    { id: 'survival' as GameMode, name: t.survival_mode, desc: t.survival_desc, icon: Heart, color: 'from-red-500 to-rose-600', shadow: 'shadow-red-500/25' },
    { id: 'chrono' as GameMode, name: t.chrono_mode, desc: t.chrono_desc, icon: Timer, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/25' },
    { id: 'map' as GameMode, name: t.map_mode, desc: t.map_desc, icon: Map, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/25' },
    { id: 'explorer' as GameMode, name: t.explorer_mode, desc: t.explorer_desc, icon: Compass, color: 'from-yellow-500 to-amber-600', shadow: 'shadow-yellow-500/25', premium: true },
  ];

  return (
    <div className="min-h-dvh flex flex-col items-center px-5 py-16 pb-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors py-2">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>
        <h2 className="text-2xl font-bold text-white mb-1">{t.choose_mode}</h2>
        <p className="text-slate-400 text-sm mb-4">{t.mode_desc}</p>

        {/* Difficulté adaptative */}
        <div className="mb-5 flex items-start gap-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl px-4 py-3">
          <TrendingUp className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
          <p className="text-indigo-200/90 text-xs leading-relaxed">{t.adaptive_difficulty_info}</p>
        </div>

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
                onClick={() => lockedPremium ? onPremium() : onStart(mode.id)}
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
