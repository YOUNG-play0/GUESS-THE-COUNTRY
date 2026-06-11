import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Heart, Flame, X, HelpCircle, MapPin, Flag } from 'lucide-react';
import { GameState, Question } from '../types';
import { countryShapes } from '../data/countryShapes';
import { countries, getCountryDisplayName } from '../data/countries';
import { useLanguage } from '../contexts/LanguageContext';

function getCountryCode(name: string): string {
  const c = countries.find(c => c.name === name);
  return c?.code?.toLowerCase() || '';
}

function CountryFlag({ name, size = 24 }: { name: string; size?: number }) {
  const code = getCountryCode(name);
  if (!code) return <span className="text-lg">🏳️</span>;
  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      alt={name}
      className="flag-img"
      style={{ width: size, height: size * 0.7 }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

interface Props {
  gameState: GameState;
  currentQuestion: Question | null;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  showResult: boolean;
  chronoTimeLeft: number;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onQuit: () => void;
}

export default function GameScreen({
  gameState, currentQuestion, selectedAnswer, isCorrect, showResult,
  chronoTimeLeft, onAnswer, onNext, onQuit,
}: Props) {
  const { t, language } = useLanguage();

  const handleAnswerClick = (answer: string) => {
    if (showResult) return;
    onAnswer(answer);
    if (navigator.vibrate) {
      // Vibrate after answer - we check correctness from the answer matching
      const correct = currentQuestion?.correctAnswer === answer;
      if (!correct) navigator.vibrate([50, 30, 50]);
      else navigator.vibrate(15);
    }
  };

  if (!currentQuestion) return null;

  const timerPercent = (gameState.timeLeft / gameState.maxTime) * 100;
  const timerColor = timerPercent > 50 ? 'bg-emerald-500' : timerPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';
  const isUrgent = timerPercent <= 25 && !showResult;

  const questionCode = currentQuestion.country.code?.toLowerCase() || '';

  const getQuestionDisplay = () => {
    const q = currentQuestion;
    switch (q.type) {
      case 'flag':
        return (
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-3 flex items-center justify-center gap-1.5 uppercase tracking-wider font-medium">
              <Flag className="w-4 h-4" /> {t.which_flag}
            </p>
            <motion.div
              key={`flag-${gameState.currentQuestion}`}
              initial={{ scale: 0.3, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={`my-5 flex justify-center ${q.blurred ? 'blur-md' : ''}`}
            >
              {questionCode ? (
                <img
                  src={`https://flagcdn.com/w320/${questionCode}.png`}
                  alt="Flag"
                  className="rounded-lg shadow-2xl border border-white/10"
                  style={{ width: 'min(280px, 70vw)', height: 'auto' }}
                />
              ) : (
                <span style={{ fontSize: '80px' }}>{q.country.flag}</span>
              )}
            </motion.div>
          </div>
        );
      case 'capital':
        return (
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-3 flex items-center justify-center gap-1.5 uppercase tracking-wider font-medium">
              <MapPin className="w-4 h-4" /> {t.which_capital}
            </p>
            <motion.div
              key={`cap-${gameState.currentQuestion}`}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="my-5"
            >
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                <span className="text-3xl">🏛️</span>
                <span className="text-2xl font-bold text-white">{q.country.capital}</span>
              </div>
            </motion.div>
          </div>
        );
      case 'monument':
        return (
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-3 flex items-center justify-center gap-1.5 uppercase tracking-wider font-medium">
              <MapPin className="w-4 h-4" /> {t.which_monument}
            </p>
            <motion.div
              key={`mon-${gameState.currentQuestion}`}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="my-5"
            >
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                <span className="text-3xl">🗽</span>
                <span className="text-2xl font-bold text-white">{q.country.monument}</span>
              </div>
            </motion.div>
          </div>
        );
      case 'hint':
        return (
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-3 flex items-center justify-center gap-1.5 uppercase tracking-wider font-medium">
              <HelpCircle className="w-4 h-4" /> {t.guess_clue}
            </p>
            <motion.div
              key={`hint-${gameState.currentQuestion}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="my-5 space-y-4"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mx-auto max-w-xs">
                <p className={`text-lg font-semibold text-indigo-300 italic leading-relaxed ${q.blurred ? 'blur-[3px]' : ''}`}>
                  "{q.hint}"
                </p>
              </div>
              <div className={`flex justify-center ${q.blurred ? 'blur-lg' : ''} ${q.zoomed ? 'scale-150 my-6' : ''}`}>
                {questionCode ? (
                  <img src={`https://flagcdn.com/w160/${questionCode}.png`} alt="Flag" className="rounded shadow-lg" style={{ width: 64 }} />
                ) : (
                  <span style={{ fontSize: 56 }}>{q.country.flag}</span>
                )}
              </div>
            </motion.div>
          </div>
        );
      case 'shape': {
        const shapePath = countryShapes[q.country.name];
        return (
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-3 flex items-center justify-center gap-1.5 uppercase tracking-wider font-medium">
              <MapPin className="w-4 h-4" /> {t.which_shape}
            </p>
            <motion.div
              key={`shape-${gameState.currentQuestion}`}
              initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
              className="my-5 flex justify-center"
            >
              {shapePath ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <svg viewBox="0 0 100 100" className="w-40 h-40">
                    <path d={shapePath} fill="rgba(99, 102, 241, 0.2)" stroke="rgba(129, 140, 248, 0.7)" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : (
                <div className="w-40 h-40 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center">
                  {questionCode ? (
                    <img src={`https://flagcdn.com/w160/${questionCode}.png`} alt="Flag" className="blur-sm rounded" style={{ width: 80 }} />
                  ) : (
                    <span className="text-6xl blur-sm select-none">{q.country.flag}</span>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-4 pt-14 max-w-lg mx-auto">
      {/* Flash overlay */}
      <AnimatePresence>
        {showResult && isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed inset-0 z-50 pointer-events-none ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}
          />
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onQuit} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <motion.div key={gameState.score} initial={false} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.3 }} className="flex items-center gap-1.5 bg-white/5 backdrop-blur px-3 py-2 rounded-xl">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-bold text-sm tabular-nums">{gameState.score}</span>
          </motion.div>
          <AnimatePresence>
            {gameState.combo >= 2 && (
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="flex items-center gap-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 px-3 py-2 rounded-xl">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 font-bold text-sm">x{gameState.multiplier}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {gameState.mode === 'survival' && (
            <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2.5 py-2 rounded-xl">
              <Heart className="w-4 h-4 text-red-400" fill="currentColor" />
              <span className="text-red-300 font-bold text-sm">{gameState.lives}</span>
            </div>
          )}
          {gameState.mode === 'chrono' && (
            <div className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border ${chronoTimeLeft <= 10 ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'} ${chronoTimeLeft <= 5 ? 'animate-pulse' : ''}`}>
              <Clock className={`w-4 h-4 ${chronoTimeLeft <= 10 ? 'text-red-400' : 'text-blue-400'}`} />
              <span className={`font-bold text-sm tabular-nums ${chronoTimeLeft <= 10 ? 'text-red-300' : 'text-white'}`}>{Math.ceil(chronoTimeLeft)}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Progress */}
      {gameState.mode !== 'chrono' && gameState.mode !== 'survival' && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>{gameState.currentQuestion + 1}</span>
            <span>{gameState.totalQuestions} total</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              animate={{ width: `${((gameState.currentQuestion + 1) / gameState.totalQuestions) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Question Timer Bar (en Chrono, seul le compteur global est affiché) */}
      {gameState.mode !== 'chrono' && (
        <div className={`h-1.5 bg-white/5 rounded-full overflow-hidden mb-4 ${isUrgent ? 'animate-pulse' : ''}`}>
          <motion.div className={`h-full ${timerColor} rounded-full`} animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.1, ease: 'linear' }} />
        </div>
      )}

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full">
          {getQuestionDisplay()}

          {/* Streak indicator */}
          <AnimatePresence>
            {gameState.combo >= 3 && !showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center mb-3">
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/15 px-4 py-1.5 rounded-full">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-300 font-bold text-xs">{gameState.combo} {t.streak} 🔥</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-2.5 mt-4">
            {currentQuestion.options.map((option, i) => {
              let btnClass = 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white';
              let extraContent = null;

              if (showResult) {
                if (option === currentQuestion.correctAnswer) {
                  btnClass = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10';
                  extraContent = <span className="text-lg shrink-0">✅</span>;
                } else if (option === selectedAnswer && !isCorrect) {
                  btnClass = 'bg-red-500/15 border-red-500/50 text-red-300 shake';
                  extraContent = <span className="text-lg shrink-0">❌</span>;
                } else {
                  btnClass = 'bg-white/[0.02] border-white/5 text-slate-600';
                }
              }

              return (
                <motion.button
                  key={`${gameState.currentQuestion}-${option}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, type: 'spring', stiffness: 300 }}
                  whileTap={!showResult ? { scale: 0.97 } : {}}
                  onClick={() => handleAnswerClick(option)}
                  disabled={showResult}
                  className={`w-full p-3.5 rounded-2xl border-2 ${btnClass} font-semibold text-left flex items-center gap-3 transition-all duration-200`}
                >
                  <span className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {currentQuestion.type !== 'flag' && (
                    <CountryFlag name={option} size={28} />
                  )}
                  <span className="flex-1 truncate text-sm">{getCountryDisplayName(option, language)}</span>
                  {extraContent && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0">
                      {extraContent}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Dramatic Result Overlay */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isCorrect ? 0.85 : 0.75 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`fixed inset-0 z-40 flex items-center justify-center pointer-events-none ${
                  isCorrect ? 'bg-emerald-500/90' : selectedAnswer === '__timeout__' ? 'bg-yellow-500/85' : 'bg-red-500/90'
                }`}
              >
                <motion.div
                  initial={{ scale: 0.2, rotate: isCorrect ? -12 : 12 }}
                  animate={{ scale: 1, rotate: 0, transition: { type: 'spring', bounce: 0.4, duration: 0.6 } }}
                  className="text-center px-8"
                >
                  <div className="text-[100px] mb-2 drop-shadow-2xl select-none">
                    {isCorrect ? '🎉' : selectedAnswer === '__timeout__' ? '⏰' : '💥'}
                  </div>
                  <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-black tracking-tighter mb-2 drop-shadow-xl text-white">
                    {isCorrect ? t.excellent : selectedAnswer === '__timeout__' ? t.times_up : t.incorrect}
                  </motion.p>
                  {isCorrect && gameState.multiplier > 1 && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="inline-block bg-white/20 backdrop-blur-md px-6 py-1.5 rounded-3xl text-white font-bold text-xl border border-white/30"
                    >
                      ×{gameState.multiplier} {t.combo_text} 🔥
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result feedback panel */}
          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.15 }} className="mt-6 text-center">
                {isCorrect ? (
                  <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="mb-4">
                    <span className="text-4xl select-none">🎉</span>
                    <p className="text-emerald-400 font-bold text-xl mt-2">{t.correct}</p>
                    {gameState.multiplier > 1 && (
                      <motion.p initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-orange-400 font-bold text-sm mt-1">
                        🔥 x{gameState.multiplier} multiplier!
                      </motion.p>
                    )}
                  </motion.div>
                ) : selectedAnswer === '__timeout__' ? (
                  <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="mb-4">
                    <span className="text-4xl select-none">⏰</span>
                    <p className="text-yellow-400 font-bold text-xl mt-2">{t.times_up}</p>
                    <p className="text-slate-400 text-sm mt-1 flex items-center justify-center gap-2">
                      {t.answer}: <CountryFlag name={currentQuestion.correctAnswer} size={20} /> {getCountryDisplayName(currentQuestion.correctAnswer, language)}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0.5 }} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }} className="mb-4">
                    <span className="text-4xl select-none">😔</span>
                    <p className="text-red-400 font-bold text-xl mt-2">{t.wrong}</p>
                    <p className="text-slate-400 text-sm mt-1 flex items-center justify-center gap-2">
                      {t.answer}: <CountryFlag name={currentQuestion.correctAnswer} size={20} /> {getCountryDisplayName(currentQuestion.correctAnswer, language)}
                    </p>
                  </motion.div>
                )}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onNext}
                  className="w-full max-w-xs mx-auto px-10 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all"
                >
                  {(gameState.mode === 'survival' && gameState.lives <= 0) ? t.see_results : t.next_question}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
