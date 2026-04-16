import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, languageOptions } from '../i18n/translations';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languageOptions.find(l => l.code === language)!;

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
    if (navigator.vibrate) navigator.vibrate(5);
  };

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.92 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium border shadow-lg ${
          isOpen
            ? 'bg-indigo-500/30 border-indigo-400/50 text-indigo-200'
            : 'bg-black/40 border-white/10 text-slate-200 hover:bg-white/10'
        }`}
      >
        <Globe2 className="w-4 h-4" />
        <div className="w-6 h-4 rounded-sm overflow-hidden border border-white/30 shrink-0 bg-slate-800">
          {imgErrors.has(current.code) ? (
            <span className="w-full h-full flex items-center justify-center text-[10px]">{current.flagEmoji}</span>
          ) : (
            <img
              src={current.flag}
              alt={current.name}
              className="w-full h-full object-cover"
              onError={() => setImgErrors(prev => new Set(prev).add(current.code))}
            />
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/50 sm:hidden" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute right-0 top-full mt-2 w-72 z-[100] bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-indigo-950/80 to-purple-950/80">
                <p className="text-white font-semibold text-sm">🌐 {t.select_language}</p>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto">
                {languageOptions.map((lang) => {
                  const isActive = lang.code === language;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                        isActive ? 'bg-indigo-500/25 border border-indigo-400/30' : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="w-8 h-6 rounded-sm overflow-hidden border border-white/20 shrink-0 bg-slate-800">
                        {imgErrors.has(lang.code) ? (
                          <span className="w-full h-full flex items-center justify-center text-sm">{lang.flagEmoji}</span>
                        ) : (
                          <img
                            src={lang.flag}
                            alt={lang.name}
                            className="w-full h-full object-cover"
                            onError={() => setImgErrors(prev => new Set(prev).add(lang.code))}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isActive ? 'text-indigo-300' : 'text-white'}`}>{lang.nativeName}</p>
                        <p className="text-xs text-slate-500">{lang.name}</p>
                      </div>
                      {isActive && (
                        <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
