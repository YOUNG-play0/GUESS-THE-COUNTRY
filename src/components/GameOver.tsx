import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Target, Flame, Star, Home, RotateCcw, Share2, X, ExternalLink, Copy, Check } from 'lucide-react';
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
  const accuracy = gameState.questionsAnswered > 0 ? Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100) : 0;
  const currentLevelData = XP_LEVELS.find(l => l.level === playerLevel) || XP_LEVELS[0];
  const nextLevelData = XP_LEVELS.find(l => l.level === playerLevel + 1);
  const xpProgress = nextLevelData ? ((playerXP - currentLevelData.xp) / (nextLevelData.xp - currentLevelData.xp)) * 100 : 100;
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const getGrade = () => {
    if (accuracy >= 90) return { emoji: '🏆', text: t.legendary, color: 'text-yellow-400' };
    if (accuracy >= 75) return { emoji: '⭐', text: t.excellent_grade, color: 'text-purple-400' };
    if (accuracy >= 60) return { emoji: '👍', text: t.great, color: 'text-blue-400' };
    if (accuracy >= 40) return { emoji: '😊', text: t.good, color: 'text-emerald-400' };
    return { emoji: '💪', text: t.keep_trying, color: 'text-slate-400' };
  };
  const grade = getGrade();

  const getShareText = () => {
    const record = isNewBest ? '🏆 NEW RECORD!' : '';
    return t.share_score_text
      .replace('{score}', String(gameState.score))
      .replace('{correct}', String(gameState.correctAnswers))
      .replace('{total}', String(gameState.questionsAnswered))
      .replace('{record}', record);
  };

  const shareScore = (platform: string) => {
    const text = getShareText();
    const url = window.location.href;
    const hashtags = 'GuessTheCountry,Geography,GeoChallenge';

    // Helper to safely open URLs in new tab
    const openUrl = (link: string) => {
      try {
        const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          // Popup blocked - fallback to copy with visual feedback
          navigator.clipboard.writeText(text + '\n\n' + url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          }).catch(() => {});
        }
      } catch (e) {
        // Fallback to copy if opening fails
        navigator.clipboard.writeText(text + '\n\n' + url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }).catch(() => {});
      }
    };

    switch (platform) {
      case 'whatsapp':
        openUrl(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n' + url)}`);
        break;

      case 'twitter':
        openUrl(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`);
        break;

      case 'facebook':
        openUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
        break;

      case 'telegram':
        openUrl(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        break;

      case 'tiktok':
        // TikTok doesn't have web share - copy text then open TikTok home
        navigator.clipboard.writeText(text + '\n\n#GuessTheCountry #Geography #GeoChallenge #Quiz').then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
          openUrl('https://www.tiktok.com/');
        }).catch(() => {
          openUrl('https://www.tiktok.com/');
        });
        return;

      case 'instagram':
        // Instagram doesn't have web share - copy text then open Instagram
        navigator.clipboard.writeText(text + '\n\n#GuessTheCountry #Geography #Quiz').then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
          openUrl('https://www.instagram.com/');
        }).catch(() => {
          openUrl('https://www.instagram.com/');
        });
        return;

      case 'native':
        if (navigator.share) {
          navigator.share({
            title: '🌍 Guess The Country',
            text: text,
            url: url
          }).catch(() => {});
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(text + '\n\n' + url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          }).catch(() => {});
        }
        return;

      case 'copy':
        navigator.clipboard.writeText(text + '\n\n' + url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }).catch(() => {});
        return;

      default:
        break;
    }
    setShowShareModal(false);
  };

  const socialButtons = [
    {
      id: 'whatsapp',
      label: t.share_whatsapp,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      bg: 'bg-[#25D366] hover:bg-[#20bd5a]',
    },
    {
      id: 'twitter',
      label: t.share_twitter,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      bg: 'bg-black hover:bg-gray-900 border border-white/20',
    },
    {
      id: 'facebook',
      label: t.share_facebook,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      bg: 'bg-[#1877F2] hover:bg-[#166fe5]',
    },
    {
      id: 'telegram',
      label: t.share_telegram,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      bg: 'bg-[#0088cc] hover:bg-[#0077b5]',
    },
    {
      id: 'tiktok',
      label: t.share_tiktok,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ),
      bg: 'bg-gradient-to-r from-[#FF0050] to-[#00F2EA] hover:from-[#e6004a] hover:to-[#00d9d3]',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: 'spring' }} className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="text-7xl mb-4 select-none">
            {grade.emoji}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`text-3xl font-black ${grade.color}`}>
            {grade.text}
          </motion.h1>
          {isNewBest && (
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} className="mt-2 inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 px-4 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span className="text-yellow-300 font-bold text-sm">{t.new_best_score}</span>
            </motion.div>
          )}
        </div>

        {/* Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-4">
          <div className="text-center mb-4">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{t.final_score}</p>
            <motion.p initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }} className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">+{gameState.xpEarned} XP</span>
            </div>
            <span className="text-indigo-300 text-sm font-medium">{t.level_title} {playerLevel} • {currentLevelData.title}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1, delay: 0.8 }} />
          </div>
          {nextLevelData && <p className="text-slate-500 text-xs mt-1 text-right">{playerXP} / {nextLevelData.xp} XP</p>}
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={onPlayAgain} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" /> {t.play_again}
          </motion.button>
          <div className="grid grid-cols-2 gap-3">
            <motion.button whileTap={{ scale: 0.96 }} onClick={onHome} className="py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <Home className="w-4 h-4" /> {t.go_home}
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowShareModal(true)} className="py-3.5 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30">
              <Share2 className="w-4 h-4" /> {t.share_score}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative p-6 text-center border-b border-white/10">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="text-5xl mb-3 select-none">📤</div>
                <h3 className="text-2xl font-bold text-white mb-1">{t.share_title}</h3>
                <p className="text-slate-400 text-sm">
                  {t.share_desc} <span className="text-emerald-400 font-mono font-bold">{gameState.score}</span> points!
                </p>
              </div>

              {/* Score Preview */}
              <div className="mx-5 mt-4 p-3 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-slate-300 text-xs leading-relaxed">{getShareText()}</p>
              </div>

              {/* Social Buttons */}
              <div className="p-5 space-y-2">
                {socialButtons.map((btn) => (
                  <motion.button
                    key={btn.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => shareScore(btn.id)}
                    className={`w-full flex items-center gap-4 p-4 ${btn.bg} text-white rounded-2xl font-semibold transition-all active:scale-95`}
                  >
                    <span className="shrink-0">{btn.icon}</span>
                    <span className="flex-1 text-left">{btn.label}</span>
                    <ExternalLink className="w-4 h-4 opacity-50 shrink-0" />
                  </motion.button>
                ))}

                {/* Divider */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-slate-500 text-xs">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Copy + Native share */}
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => shareScore('copy')}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl font-semibold transition-all ${
                      copied
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
                    }`}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    <span className="text-sm">{copied ? '✓' : t.share_copy}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => shareScore('native')}
                    className="flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">{t.share_native}</span>
                  </motion.button>
                </div>

                {/* Copied confirmation */}
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center py-2"
                    >
                      <p className="text-emerald-400 text-sm font-medium">{t.share_success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Close */}
              <div className="p-4 border-t border-white/10">
                <button onClick={() => setShowShareModal(false)} className="w-full py-3 text-slate-400 hover:text-white text-sm font-medium transition-colors">
                  {t.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
