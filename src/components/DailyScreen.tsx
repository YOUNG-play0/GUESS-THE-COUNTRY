import { motion } from 'framer-motion';
import { Play, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { DailyState } from '../hooks/useProgress';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  daily: DailyState | null;
  onPlay: () => void;
}

// Page dédiée au Défi du jour (onglet 📅 de la BottomNav).
export default function DailyScreen({ daily, onPlay }: Props) {
  const { t } = useLanguage();
  const [shared, setShared] = useState(false);

  const share = () => {
    if (!daily) return;
    const text = t.daily_share_text
      .replace('{score}', String(daily.correct))
      .replace('{total}', String(daily.total));
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
      return;
    }
    navigator.clipboard?.writeText(text).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="min-h-dvh px-4 pt-16 pb-36">
      <div className="w-full max-w-[480px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 mt-6">
          <motion.span
            animate={{ rotate: [0, -6, 6, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-block text-6xl select-none mb-3"
          >
            📅
          </motion.span>
          <h2 className="text-3xl font-black text-white">{t.daily_challenge}</h2>
          <p className="text-slate-400 text-sm mt-2">{t.daily_desc}</p>
        </motion.div>

        {daily ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="bg-white/5 border border-emerald-500/25 rounded-3xl p-8 text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">{t.final_score}</p>
              <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                {daily.correct}/{daily.total}
              </p>
              <p className="text-slate-400 text-sm mt-4">{t.come_back_tomorrow}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={share}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              {shared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {shared ? t.copied_clipboard : t.share_score}
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={onPlay}
            className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xl rounded-3xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 transition-all"
          >
            <Play className="w-6 h-6" fill="currentColor" />
            {t.play_now}
          </motion.button>
        )}
      </div>
    </div>
  );
}
