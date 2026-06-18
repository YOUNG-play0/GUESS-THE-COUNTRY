import { motion } from 'framer-motion';
import AtlasAvatar from './AtlasAvatar';
import { useLanguage } from '../contexts/LanguageContext';

// Écran "Nouvelle saison" — affiché une seule fois aux anciens joueurs
// quand ATLAS débarque. Reset complet de la progression.
export default function SeasonScreen({ onStart }: { onStart: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <AtlasAvatar expression="wow" size={120} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-indigo-300"
      >
        {t.season_tag}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="mt-2 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300"
      >
        {t.season_title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-4 max-w-xs text-slate-300 text-sm leading-relaxed"
      >
        {t.season_desc}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.96 }}
        onClick={onStart}
        className="mt-10 px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-indigo-500/30"
      >
        {t.season_cta}
      </motion.button>
    </div>
  );
}
