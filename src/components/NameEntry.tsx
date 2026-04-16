import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onSubmit: (name: string) => void;
  onBack: () => void;
}

export default function NameEntry({ onSubmit, onBack }: Props) {
  const { t } = useLanguage();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) onSubmit(name.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t.enter_name}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.enter_name_desc}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.name_placeholder}
            maxLength={20}
            autoFocus
            className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-center text-lg font-semibold placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {t.continue} <ArrowRight className="w-5 h-5" />
          </motion.button>
          <button type="button" onClick={onBack} className="w-full py-3 text-slate-400 hover:text-white text-sm font-medium transition-colors">
            {t.back}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
