import { motion } from 'framer-motion';
import { Home, BarChart3, User } from 'lucide-react';
import { Screen } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

// Barre de navigation fixe en bas, affichée sur les écrans « hub »
// (accueil, passeport, stats, profil) — jamais en partie.
export default function BottomNav({ current, onNavigate }: Props) {
  const { t } = useLanguage();

  const tabs: { id: Screen; label: string; icon?: typeof Home; emoji?: string }[] = [
    { id: 'home', label: t.nav_home, icon: Home },
    { id: 'passport', label: t.passport, emoji: '🛂' },
    { id: 'stats', label: t.stats, icon: BarChart3 },
    { id: 'profile', label: t.profile, icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 w-full max-w-[480px] mx-auto bg-slate-950/80 backdrop-blur-xl border-t border-white/10 sm:border-x sm:rounded-t-2xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-4">
        {tabs.map(tab => {
          const active = current === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="relative py-2.5 flex flex-col items-center gap-0.5 transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute top-0 h-0.5 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
                />
              )}
              {Icon ? (
                <Icon className={`w-5 h-5 ${active ? 'text-indigo-300' : 'text-slate-500'}`} />
              ) : (
                <span className={`text-[17px] leading-5 select-none ${active ? '' : 'grayscale opacity-60'}`}>{tab.emoji}</span>
              )}
              <span className={`text-[10px] font-semibold ${active ? 'text-indigo-300' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
