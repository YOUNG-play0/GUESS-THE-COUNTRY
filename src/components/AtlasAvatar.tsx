import { type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { AtlasExpression } from '../data/atlas';

// Petit personnage ATLAS en SVG pur (aucune image externe).
// Tête d'explorateur dont les yeux/sourcils/bouche changent selon l'humeur.
export default function AtlasAvatar({ expression = 'normal', size = 56 }: { expression?: AtlasExpression; size?: number }) {
  // Éléments du visage par expression
  const faces: Record<AtlasExpression, { eyes: ReactElement; brows: ReactElement; mouth: ReactElement }> = {
    normal: {
      brows: <>
        <rect x="30" y="40" width="12" height="3" rx="1.5" fill="#1e293b" />
        <rect x="58" y="40" width="12" height="3" rx="1.5" fill="#1e293b" transform="rotate(-8 64 41)" />
      </>,
      eyes: <>
        <circle cx="36" cy="50" r="4" fill="#1e293b" />
        <circle cx="64" cy="50" r="4" fill="#1e293b" />
      </>,
      // sourire en coin (😏)
      mouth: <path d="M40 64 Q52 70 66 62" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />,
    },
    combo: {
      brows: <>
        <rect x="30" y="38" width="12" height="3" rx="1.5" fill="#1e293b" transform="rotate(-6 36 39)" />
        <rect x="58" y="38" width="12" height="3" rx="1.5" fill="#1e293b" transform="rotate(6 64 39)" />
      </>,
      eyes: <>
        <path d="M32 50 L40 47 L32 53 Z" fill="#1e293b" />
        <path d="M68 50 L60 47 L68 53 Z" fill="#1e293b" />
      </>,
      // grand sourire (🔥)
      mouth: <path d="M38 60 Q52 76 66 60 Q52 66 38 60 Z" fill="#1e293b" />,
    },
    duelLoss: {
      brows: <>
        <rect x="30" y="44" width="13" height="3.5" rx="1.5" fill="#1e293b" transform="rotate(14 36 45)" />
        <rect x="57" y="44" width="13" height="3.5" rx="1.5" fill="#1e293b" transform="rotate(-14 64 45)" />
      </>,
      eyes: <>
        <circle cx="36" cy="52" r="4" fill="#1e293b" />
        <circle cx="64" cy="52" r="4" fill="#1e293b" />
      </>,
      // moue contrariée (😤)
      mouth: <path d="M40 66 Q52 60 64 66" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />,
    },
    laugh: {
      brows: <>
        <rect x="30" y="40" width="12" height="3" rx="1.5" fill="#1e293b" />
        <rect x="58" y="40" width="12" height="3" rx="1.5" fill="#1e293b" />
      </>,
      // yeux rieurs (^^)
      eyes: <>
        <path d="M31 51 Q36 46 41 51" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M59 51 Q64 46 69 51" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>,
      // bouche ouverte qui rit (😂)
      mouth: <path d="M40 60 Q52 78 64 60 Q52 70 40 60 Z" fill="#1e293b" />,
    },
    wow: {
      brows: <>
        <rect x="30" y="36" width="12" height="3" rx="1.5" fill="#1e293b" />
        <rect x="58" y="36" width="12" height="3" rx="1.5" fill="#1e293b" />
      </>,
      // grands yeux émerveillés (🤩)
      eyes: <>
        <circle cx="36" cy="50" r="6" fill="#fff" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="36" cy="50" r="2.5" fill="#1e293b" />
        <circle cx="64" cy="50" r="6" fill="#fff" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="64" cy="50" r="2.5" fill="#1e293b" />
      </>,
      mouth: <ellipse cx="52" cy="64" rx="7" ry="6" fill="#1e293b" />,
    },
  };

  const f = faces[expression];

  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 104 104"
      animate={{ y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))' }}
    >
      <defs>
        <linearGradient id="atlas-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd9a8" />
          <stop offset="100%" stopColor="#f0b878" />
        </linearGradient>
        <linearGradient id="atlas-hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      {/* Tête */}
      <circle cx="52" cy="56" r="34" fill="url(#atlas-skin)" />
      {/* Chapeau d'explorateur */}
      <path d="M16 36 Q52 8 88 36 Q52 30 16 36 Z" fill="url(#atlas-hat)" />
      <rect x="20" y="34" width="64" height="7" rx="3.5" fill="#4338ca" />
      <circle cx="52" cy="22" r="3.5" fill="#a5b4fc" />
      {/* Visage */}
      {f.brows}
      {f.eyes}
      {f.mouth}
    </motion.svg>
  );
}
