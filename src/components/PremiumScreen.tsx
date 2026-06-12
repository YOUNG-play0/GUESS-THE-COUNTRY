import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, Crown, Sparkles } from 'lucide-react';
import { PremiumPlan, PRICES } from '../hooks/usePremium';
import { useLanguage } from '../contexts/LanguageContext';
import { continentLabel } from '../i18n/translations';

interface Props {
  plan: PremiumPlan;
  trialDaysLeft: number;
  trialUsed: boolean;
  continentPacks: string[];
  onStartTrial: () => void;
  onSubscribe: (plan: 'monthly' | 'yearly') => void;
  onBuyPack: (continent: string) => void;
  onBack: () => void;
}

const CONTINENTS = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];

// Écran de présentation du Passe du Savoir (6.5.5).
// Les boutons activent un abonnement de DÉMO local : le paiement réel
// arrivera avec Google Play Billing (phase 5).
export default function PremiumScreen({
  plan, trialDaysLeft, trialUsed, continentPacks,
  onStartTrial, onSubscribe, onBuyPack, onBack,
}: Props) {
  const { t } = useLanguage();
  const isPremium = plan !== 'free';

  const freeFeatures = [t.feat_all_modes, t.feat_countries, t.feat_streak_daily, t.feat_passport_base, t.feat_quests_free];
  const premiumFeatures = [t.feat_explorer, t.feat_monuments, t.feat_themes, t.feat_continent_stats, t.feat_weekly_freeze, t.feat_premium_quests];

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="w-full max-w-[480px] mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors py-2">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="inline-block text-6xl select-none mb-2"
          >
            👑
          </motion.div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
            {t.premium_title}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{t.premium_subtitle}</p>
        </motion.div>

        {/* Statut actif */}
        {isPremium && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-center">
            <p className="text-yellow-300 font-bold flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              {plan === 'trial'
                ? t.trial_active.replace('{n}', String(trialDaysLeft))
                : t.premium_active}
            </p>
          </motion.div>
        )}

        {/* Comparaison gratuit / premium */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-slate-300 font-bold text-sm mb-3">{t.premium_free_col}</p>
            <ul className="space-y-2">
              {freeFeatures.map(f => (
                <li key={f} className="flex items-start gap-1.5 text-[12px] text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
              {premiumFeatures.slice(0, 3).map(f => (
                <li key={f} className="flex items-start gap-1.5 text-[12px] text-slate-600">
                  <X className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-b from-yellow-500/15 to-amber-600/5 border border-yellow-500/30 rounded-2xl p-4 relative overflow-hidden">
            <p className="text-yellow-300 font-bold text-sm mb-3 flex items-center gap-1">
              <Crown className="w-4 h-4" /> {t.premium_pass_col}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-1.5 text-[12px] text-slate-200">
                <Check className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" /> {t.feat_everything_free}
              </li>
              {premiumFeatures.map(f => (
                <li key={f} className="flex items-start gap-1.5 text-[12px] text-slate-200">
                  <Check className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA essai + abonnements */}
        {!isPremium && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3 mb-6">
            {!trialUsed && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                onClick={onStartTrial}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-lg rounded-2xl shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> {t.trial_cta}
              </motion.button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => onSubscribe('monthly')}
                className="py-3.5 bg-white/5 border border-white/15 rounded-2xl text-center hover:bg-white/10 transition-all"
              >
                <p className="text-white font-bold">{PRICES.monthly}</p>
                <p className="text-slate-400 text-xs">{t.per_month}</p>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => onSubscribe('yearly')}
                className="py-3.5 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-center hover:bg-yellow-500/20 transition-all relative"
              >
                <span className="absolute -top-2 right-2 bg-yellow-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">-58%</span>
                <p className="text-yellow-300 font-bold">{PRICES.yearly}</p>
                <p className="text-slate-400 text-xs">{t.per_year}</p>
              </motion.button>
            </div>
            <p className="text-slate-500 text-[11px] text-center">{t.cancel_anytime}</p>
          </motion.div>
        )}

        {/* Pack Continent (6.5.4) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
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
                  <span className="text-[11px] font-bold shrink-0">
                    {owned || isPremium ? '✓' : PRICES.continentPack}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Note démo / Play Billing */}
        <p className="text-slate-600 text-[11px] text-center leading-relaxed">
          {t.payment_demo_note}
        </p>
      </div>
    </div>
  );
}
