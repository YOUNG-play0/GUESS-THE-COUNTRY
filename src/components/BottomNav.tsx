import { motion } from 'framer-motion';
import { Screen } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  current: Screen;
  /** Masquée au scroll vers le bas (useHideOnScroll) */
  hidden?: boolean;
  onNavigate: (screen: Screen) => void;
}

// Barre de navigation fixe en bas — 5 onglets, chacun avec sa page dédiée :
// 🏠 Accueil · 🗺️ Passeport · 📅 Défi · 💎 Passe · 👤 Profil
export default function BottomNav({ current, hidden = false, onNavigate }: Props) {
  const { t } = useLanguage();

  const tabs: { id: Screen; label: string; emoji: string }[] = [
    { id: 'home', label: t.nav_home, emoji: '🏠' },
    { id: 'passport', label: t.passport, emoji: '🗺️' },
    { id: 'daily', label: t.nav_daily, emoji: '📅' },
    { id: 'premium', label: t.nav_pass, emoji: '💎' },
    { id: 'profile', label: t.profile, emoji: '👤' },
  ];

  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-50 w-full max-w-[480px] mx-auto bg-slate-950/80 backdrop-blur-xl border-t border-white/10 sm:border-x sm:rounded-t-2xl transition-transform duration-300 ease-out ${
        hidden ? 'translate-y-full' : 'translate-y-0'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5">
        {tabs.map(tab => {
          const active = current === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="relative py-2.5 flex flex-col items-center gap-0.5 transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute top-0 h-0.5 w-9 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
                />
              )}
              <span className={`text-[17px] leading-5 select-none ${active ? '' : 'grayscale opacity-60'}`}>
                {tab.emoji}
              </span>
              <span className={`text-[10px] font-semibold truncate max-w-full px-0.5 ${active ? 'text-indigo-300' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
