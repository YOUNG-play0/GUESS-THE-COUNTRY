import { motion, AnimatePresence } from 'framer-motion';
import { BadgeDef, badgeLabel } from '../data/badges';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  badges: BadgeDef[];
  onClose: () => void;
}

// Popup affichée à la fin d'une partie quand un ou plusieurs succès
// viennent d'être débloqués.
export default function BadgePopup({ badges, onClose }: Props) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.6, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-full max-w-xs bg-gradient-to-b from-slate-900 to-slate-950 border border-yellow-500/30 rounded-3xl p-6 text-center shadow-2xl shadow-yellow-500/10"
            onClick={e => e.stopPropagation()}
          >
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
              className="text-yellow-300 font-black text-lg mb-4"
            >
              🏅 {t.badge_unlocked}
            </motion.p>
            <div className="space-y-3 mb-5">
              {badges.map((b, i) => {
                const { name, desc } = badgeLabel(b, t);
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.15 }}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-left"
                  >
                    <motion.span
                      animate={{ rotate: [0, -12, 12, 0] }}
                      transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                      className="text-3xl select-none"
                    >
                      {b.emoji}
                    </motion.span>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm">{name}</p>
                      <p className="text-slate-400 text-xs">{desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 font-bold rounded-2xl"
            >
              {t.close}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
