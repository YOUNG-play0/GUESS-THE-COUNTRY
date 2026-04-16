import { motion } from 'framer-motion';
import { Trophy, Zap, Target, Flame, Star, Home, RotateCcw, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { GameState, XP_LEVELS } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  gameState: GameState;
  playerLevel: number;
  playerXP: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}

export default function GameOver({ gameState, playerLevel, playerXP, isNewBest, onPlayAgain, onHome }: Props) {
  const { t } = useLanguage();
  const [linkCopied, setLinkCopied] = useState(false);
  const accuracy = gameState.questionsAnswered > 0 ? Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100) : 0;
  const DISCORD_URL = 'https://discord.gg/wzqAHmG3jt';

  const copyDiscordLink = () => {
    navigator.clipboard.writeText(DISCORD_URL).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = DISCORD_URL;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };
  const currentLevelData = XP_LEVELS.find(l => l.level === playerLevel) || XP_LEVELS[0];
  const nextLevelData = XP_LEVELS.find(l => l.level === playerLevel + 1);
  const xpProgress = nextLevelData ? ((playerXP - currentLevelData.xp) / (nextLevelData.xp - currentLevelData.xp)) * 100 : 100;

  const getGrade = () => {
    if (accuracy >= 90) return { emoji: '🏆', text: t.legendary, color: 'text-yellow-400' };
    if (accuracy >= 75) return { emoji: '⭐', text: t.excellent_grade, color: 'text-purple-400' };
    if (accuracy >= 60) return { emoji: '👍', text: t.great, color: 'text-blue-400' };
    if (accuracy >= 40) return { emoji: '😊', text: t.good, color: 'text-emerald-400' };
    return { emoji: '💪', text: t.keep_trying, color: 'text-slate-400' };
  };
  const grade = getGrade();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, type: 'spring' }} 
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} 
            className="text-7xl mb-4 select-none"
          >
            {grade.emoji}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }} 
            className={`text-3xl font-black ${grade.color}`}
          >
            {grade.text}
          </motion.h1>
          {isNewBest && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.5, type: 'spring' }} 
              className="mt-2 inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 px-4 py-1.5 rounded-full"
            >
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span className="text-yellow-300 font-bold text-sm">{t.new_best_score}</span>
            </motion.div>
          )}
        </div>

        {/* Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }} 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-4"
        >
          <div className="text-center mb-4">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{t.final_score}</p>
            <motion.p 
              initial={{ scale: 0.5 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.6, type: 'spring' }} 
              className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"
            >
              {gameState.score}
            </motion.p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Target className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-white font-bold">{accuracy}%</p>
              <p className="text-slate-500 text-[10px]">{t.accuracy}</p>
            </div>
            <div className="text-center">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-white font-bold">{gameState.bestCombo}</p>
              <p className="text-slate-500 text-[10px]">{t.best_combo}</p>
            </div>
            <div className="text-center">
              <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-white font-bold text-sm">{gameState.correctAnswers}/{gameState.questionsAnswered}</p>
              <p className="text-slate-500 text-[10px]">{t.correct_answers}</p>
            </div>
          </div>
        </motion.div>

        {/* XP Gained */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }} 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">+{gameState.xpEarned} XP</span>
            </div>
            <span className="text-indigo-300 text-sm font-medium">{t.level_title} {playerLevel} • {currentLevelData.title}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
              initial={{ width: 0 }} 
              animate={{ width: `${xpProgress}%` }} 
              transition={{ duration: 1, delay: 0.8 }} 
            />
          </div>
          {nextLevelData && <p className="text-slate-500 text-xs mt-1 text-right">{playerXP} / {nextLevelData.xp} XP</p>}
        </motion.div>

        {/* Discord - Simple copy button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8 }} 
          className="mb-6"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={copyDiscordLink}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300 ${
              linkCopied 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : 'bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-indigo-500/25'
            }`}
          >
            {linkCopied ? (
              <>
                <Check className="w-6 h-6" />
                {t.share_copied}
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <Copy className="w-5 h-5 opacity-70" />
                {t.copy_discord_link}
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.9 }} 
          className="space-y-3"
        >
          <motion.button 
            whileTap={{ scale: 0.97 }} 
            onClick={onPlayAgain} 
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> {t.play_again}
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.96 }} 
            onClick={onHome} 
            className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <Home className="w-4 h-4" /> {t.go_home}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
