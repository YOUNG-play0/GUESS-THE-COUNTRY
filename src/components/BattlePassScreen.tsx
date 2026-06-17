import { motion } from 'framer-motion';
import { Crown, Lock, Check, Sparkles } from 'lucide-react';
import { PremiumPlan, PRICES } from '../hooks/usePremium';
import { PASS_LEVELS, passThreshold, passLevelForPoints, FREE_TRACK, PREMIUM_TRACK, PassReward } from '../data/battlePass';
import { useLanguage } from '../contexts/LanguageContext';
import { Translations, continentLabel } from '../i18n/translations';

interface Props {
  passPoints: number;
  plan: PremiumPlan;
  trialDaysLeft: number;
  trialUsed: boolean;
  continentPacks: string[];
  onStartTrial: () => void;
  onSubscribe: (plan: 'monthly' | 'yearly') => void;
  onBuyPack: (continent: string) => void;
}

const CONTINENTS = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];

function rewardDisplay(r: PassReward, t: Translations): { emoji: string; label: string } {
  switch (r.type) {
    case 'xp': return { emoji: '⚡', label: `+${r.amount} XP` };
    case 'freeze': return { emoji: '❄️', label: t.reward_freeze };
    case 'badge': return { emoji: r.id === 'pass_gold' ? '🥇' : r.id === 'pass_silver' ? '🥈' : '🥉', label: t.reward_badge };
    case 'theme': return { emoji: '🎨', label: t.reward_theme };
    case 'title': return { emoji: '📜', label: r.title };
    case 'frame': return { emoji: '🖼️', label: t.reward_frame };
  }
}

// Passe de Combat : 30 niveaux, voie gratuite + voie premium 👑, débloqués
// avec les Points de Passe gagnés en jouant. Achats en DÉMO locale
// (Google Play Billing en phase 5).
export default function BattlePassScreen({
  passPoints, plan, trialDaysLeft, trialUsed, continentPacks,
  onStartTrial, onSubscribe, onBuyPack,
}: Props) {
  const { t } = useLanguage();
  const isPremium = plan !== 'free';
  const level = passLevelForPoints(passPoints);
  const curBase = passThreshold(level);
  const nextCost = passThreshold(level + 1) - curBase;
  const inLevel = passPoints - curBase;
  const globalPct = level >= PASS_LEVELS ? 100 : Math.min(100, (inLevel / nextCost) * 100);

  return (
    <div className="min-h-dvh px-4 pt-16 pb-36">
      <div className="w-full max-w-[480px] mx-auto">

        {/* En-tête + progression globale */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5 mt-2">
          <span className="text-5xl select-none">💎</span>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 mt-1">
            {t.battle_pass}
          </h2>
          <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white font-bold text-sm">
                {t.level_title} <span className="text-indigo-300">{level}</span>/{PASS_LEVELS}
              </span>
              <span className="text-cyan-300 font-bold text-xs">💠 {passPoints} {t.pass_points}</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${globalPct}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            {level < PASS_LEVELS && (
              <p className="text-slate-500 text-[11px] mt-1 text-right">{inLevel}/{nextCost}</p>
            )}
          </div>
        </motion.div>

        {/* CTA premium */}
        {isPremium ? (
          <div className="mb-5 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-3 text-center">
            <p className="text-yellow-300 font-bold text-sm flex items-center justify-center gap-2">
              <Crown className="w-4 h-4" />
              {plan === 'trial' ? t.trial_active.replace('{n}', String(trialDaysLeft)) : t.premium_active}
            </p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 space-y-2.5">
            {!trialUsed && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                onClick={onStartTrial}
                className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black rounded-2xl shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> {t.trial_cta}
              </motion.button>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={() => onSubscribe('monthly')} className="py-3 bg-white/5 border border-white/15 rounded-2xl text-center hover:bg-white/10 transition-all">
                <p className="text-white font-bold text-sm">👑 {PRICES.monthly}</p>
                <p className="text-slate-400 text-[11px]">{t.activate_premium} · {t.per_month}</p>
              </button>
              <button onClick={() => onSubscribe('yearly')} className="py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-center hover:bg-yellow-500/20 transition-all relative">
                <span className="absolute -top-2 right-2 bg-yellow-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">-58%</span>
                <p className="text-yellow-300 font-bold text-sm">👑 {PRICES.yearly}</p>
                <p className="text-slate-400 text-[11px]">{t.activate_premium} · {t.per_year}</p>
              </button>
            </div>
          </motion.div>
        )}

        {/* Piste horizontale niveau par niveau */}
        <div className="-mx-4 mb-6">
          <div className="flex items-center justify-between px-4 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.premium_free_col}</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1">
              <Crown className="w-3 h-3" /> Premium
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 snap-x [scrollbar-width:thin]">
            {Array.from({ length: PASS_LEVELS }, (_, i) => {
              const lvl = i + 1;
              const reached = level >= lvl;
              const free = rewardDisplay(FREE_TRACK[i], t);
              const prem = rewardDisplay(PREMIUM_TRACK[i], t);
              return (
                <div key={lvl} className="snap-start shrink-0 w-[104px] flex flex-col gap-1.5">
                  {/* Numéro de niveau */}
                  <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border ${
                    reached
                      ? 'bg-gradient-to-br from-cyan-400 to-indigo-500 text-white border-transparent'
                      : lvl === level + 1
                        ? 'bg-white/10 text-white border-indigo-400/60'
                        : 'bg-white/[0.03] text-slate-500 border-white/10'
                  }`}>
                    {lvl}
                  </div>
                  {/* Récompense gratuite */}
                  <div className={`rounded-xl border p-2 text-center h-[72px] flex flex-col items-center justify-center ${
                    reached ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.03] border-white/10 opacity-60'
                  }`}>
                    <span className="text-xl select-none">{free.emoji}</span>
                    <span className={`text-[10px] leading-tight mt-0.5 ${reached ? 'text-emerald-200' : 'text-slate-400'}`}>{free.label}</span>
                    {reached && <Check className="w-3 h-3 text-emerald-400 mt-0.5" />}
                  </div>
                  {/* Récompense premium */}
                  <div className={`relative rounded-xl border p-2 text-center h-[72px] flex flex-col items-center justify-center ${
                    reached && isPremium
                      ? 'bg-gradient-to-b from-yellow-500/20 to-amber-600/10 border-yellow-400/40'
                      : 'bg-yellow-500/[0.04] border-yellow-500/15 opacity-70'
                  }`}>
                    {!isPremium && (
                      <Lock className="absolute top-1 right-1 w-3 h-3 text-yellow-500/70" />
                    )}
                    <span className={`text-xl select-none ${!isPremium ? 'grayscale' : ''}`}>{prem.emoji}</span>
                    <span className={`text-[10px] leading-tight mt-0.5 ${reached && isPremium ? 'text-yellow-200' : 'text-slate-500'}`}>{prem.label}</span>
                    {reached && isPremium && <Check className="w-3 h-3 text-yellow-400 mt-0.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comment gagner des points */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-slate-300 text-xs leading-relaxed">{t.pass_points_info}</p>
        </div>

        {/* Pack Continent (achat unique) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <p className="text-white font-bold text-sm mb-1">🗺️ {t.continent_pack}</p>
          <p className="text-slate-400 text-xs mb-3">{t.continent_pack_desc}</p>
          <div className="grid grid-cols-2 gap-2">
            {CONTINENTS.map(c => {
              const owned = continentPacks.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => !owned && !isPremium && onBuyPack(c)}
                  disabled={owned || isPremium}
                  className={`px-3 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                    owned || isPremium
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                      : 'bg-white/[0.03] border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs font-semibold truncate">{continentLabel(c, t)}</span>
                  <span className="text-[11px] font-bold shrink-0">{owned || isPremium ? '✓' : PRICES.continentPack}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-slate-600 text-[11px] text-center leading-relaxed">{t.payment_demo_note}</p>
      </div>
    </div>
  );
}
