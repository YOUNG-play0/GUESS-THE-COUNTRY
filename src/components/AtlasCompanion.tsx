import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import AtlasAvatar from './AtlasAvatar';
import { AtlasMessage } from '../hooks/useAtlas';

interface Props {
  message: AtlasMessage | null;
  visible: boolean;
  onToggle: () => void;
  onBubbleEnd?: () => void;
  /** Position : en bas à gauche par défaut (pendant la partie) */
  bubbleDuration?: number;
}

// Avatar ATLAS + bulle de dialogue, en bas à gauche pendant la partie.
// Peut être réduit (bouton ✕) → ne reste qu'une petite pastille pour le rouvrir.
export default function AtlasCompanion({ message, visible, onToggle, onBubbleEnd, bubbleDuration = 4200 }: Props) {
  // La bulle disparaît seule après un délai
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onBubbleEnd?.(), bubbleDuration);
    return () => clearTimeout(id);
  }, [message, bubbleDuration, onBubbleEnd]);

  if (!visible) {
    return (
      <button
        onClick={onToggle}
        aria-label="Afficher Atlas"
        className="fixed bottom-4 left-3 z-40 w-11 h-11 rounded-full bg-indigo-600/90 border border-white/20 shadow-lg flex items-center justify-center"
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-3 z-40 flex items-end gap-2 pointer-events-none">
      <div className="relative pointer-events-auto">
        <AtlasAvatar expression={message?.expression ?? 'normal'} size={56} />
        <button
          onClick={onToggle}
          aria-label="Masquer Atlas"
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900/90 border border-white/20 flex items-center justify-center"
        >
          <X className="w-3 h-3 text-slate-300" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, scale: 0.8, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="pointer-events-auto max-w-[220px] mb-3 bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 rounded-2xl rounded-bl-sm px-3 py-2 shadow-xl"
          >
            <p className="text-[12px] leading-snug text-slate-100">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
