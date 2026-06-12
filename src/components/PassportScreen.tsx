import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { countries, getCountryDisplayName } from '../data/countries';
import { useLanguage } from '../contexts/LanguageContext';
import { continentLabel } from '../i18n/translations';

interface Props {
  passport: string[];
  onBack: () => void;
}

const CONTINENT_ORDER = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];

// Le Passeport : chaque pays correctement deviné au moins une fois est
// « débloqué » (drapeau en couleur), les autres restent grisés.
export default function PassportScreen({ passport, onBack }: Props) {
  const { t, language } = useLanguage();
  const unlocked = new Set(passport);

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors py-2">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">🛂 {t.passport}</h2>
          <p className="text-slate-400 text-sm">{t.passport_desc}</p>
          <p className="mt-2 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            {passport.length}/{countries.length}
          </p>
        </div>

        <div className="space-y-5">
          {CONTINENT_ORDER.map((continent, ci) => {
            const list = countries
              .filter(c => c.continent === continent)
              .sort((a, b) => getCountryDisplayName(a.name, language).localeCompare(getCountryDisplayName(b.name, language)));
            const found = list.filter(c => unlocked.has(c.name)).length;
            return (
              <motion.div
                key={continent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.07 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold text-sm">{continentLabel(continent, t)}</h3>
                  <span className={`text-xs font-bold ${found === list.length ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {found === list.length ? '✓ ' : ''}{found}/{list.length}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-full ${found === list.length ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(found / list.length) * 100}%` }}
                    transition={{ duration: 0.8, delay: ci * 0.07 }}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {list.map(c => {
                    const has = unlocked.has(c.name);
                    return (
                      <span
                        key={c.name}
                        title={getCountryDisplayName(c.name, language)}
                        className={`text-xl leading-none select-none transition-all ${has ? '' : 'opacity-25'}`}
                        style={has ? undefined : { filter: 'grayscale(1)' }}
                      >
                        {c.flag}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
