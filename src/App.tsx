import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Screen, GameMode, Difficulty } from './types';
import { useStorage } from './hooks/useStorage';
import { useGameEngine } from './hooks/useGameEngine';
import { useProgress, FREEZE_COST_XP, MAX_FREEZES, todayKey } from './hooks/useProgress';
import { generateDailyQuestions } from './utils/daily';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import WorldBackground from './components/WorldBackground';
import HomeScreen from './components/HomeScreen';
import NameEntry from './components/NameEntry';
import ModeSelect from './components/ModeSelect';
import GameScreen from './components/GameScreen';
import GameOver from './components/GameOver';
import StatsScreen from './components/StatsScreen';
import ProfileScreen from './components/ProfileScreen';
import PassportScreen from './components/PassportScreen';
import ChatAssistant from './components/ChatAssistant';
import LanguageSelector from './components/LanguageSelector';

// En dessous de ce nombre de questions répondues, une partie quittée
// est considérée comme abandonnée et n'est pas comptée dans les stats.
const MIN_QUESTIONS_TO_RECORD = 3;

function AppContent() {
  const { isRTL } = useLanguage();
  const [screen, setScreen] = useState<Screen>('home');
  const [lastMode, setLastMode] = useState<GameMode>('classic');
  const [lastDifficulty, setLastDifficulty] = useState<Difficulty>('easy');
  const gameRecordedRef = useRef(false);
  const {
    stats,
    addXP,
    spendXP,
    recordGame,
    setPlayerName,
  } = useStorage();

  const {
    streak, freezes, touchStreak, addFreeze,
    dailyToday, startDaily, finishDaily,
    questsToday, applyGameSummary, passport,
  } = useProgress();

  const handleBuyFreeze = useCallback(() => {
    if (spendXP(FREEZE_COST_XP)) addFreeze();
  }, [spendXP, addFreeze]);

  const {
    gameState,
    currentQuestion,
    selectedAnswer,
    isCorrect,
    showResult,
    chronoTimeLeft,
    startGame,
    handleAnswer,
    nextQuestion,
    endGame,
    clearTimers,
  } = useGameEngine();

  useEffect(() => {
    if (gameState && !gameState.isActive && screen === 'game' && !gameRecordedRef.current) {
      gameRecordedRef.current = true;
      addXP(gameState.xpEarned);
      recordGame(
        gameState.score,
        gameState.mode,
        gameState.bestCombo,
        gameState.correctAnswers,
        gameState.questionsAnswered
      );
      touchStreak();
      if (gameState.mode === 'daily') finishDaily(gameState.correctAnswers);
      const questXp = applyGameSummary({
        mode: gameState.mode,
        score: gameState.score,
        bestCombo: gameState.bestCombo,
        correctAnswers: gameState.correctAnswers,
        correctByContinent: gameState.correctByContinent,
        correctFlags: gameState.correctFlags,
        correctCountries: gameState.correctCountries,
      });
      if (questXp > 0) addXP(questXp);
      setScreen('game-over');
    }
  }, [gameState?.isActive]);

  const handleStartGame = useCallback((mode: GameMode, difficulty: Difficulty) => {
    setLastMode(mode);
    setLastDifficulty(difficulty);
    gameRecordedRef.current = false;
    startGame(mode, difficulty);
    setScreen('game');
  }, [startGame]);

  const handleStartDaily = useCallback(() => {
    if (!stats.name) {
      setScreen('name-entry');
      return;
    }
    const qs = generateDailyQuestions(todayKey());
    startDaily(qs.length);
    gameRecordedRef.current = false;
    startGame('daily', 'medium', qs);
    setScreen('game');
  }, [stats.name, startDaily, startGame]);

  const handleQuitGame = useCallback(() => {
    clearTimers();
    if (!gameState) return;
    if (gameState.questionsAnswered < MIN_QUESTIONS_TO_RECORD) {
      gameRecordedRef.current = true;
      endGame();
      setScreen('home');
      return;
    }
    endGame();
  }, [clearTimers, endGame, gameState]);

  const handlePlayAgain = useCallback(() => {
    handleStartGame(lastMode, lastDifficulty);
  }, [handleStartGame, lastMode, lastDifficulty]);

  const handleNameSubmit = useCallback((name: string) => {
    setPlayerName(name);
    setScreen('mode-select');
  }, [setPlayerName]);

  const handleNext = useCallback(() => {
    if (gameState && !gameState.isActive) {
      setScreen('game-over');
      return;
    }
    nextQuestion();
  }, [gameState, nextQuestion]);

  const isNewBest = gameState ? gameState.score >= stats.bestScore && gameState.score > 0 : false;

  return (
    <div
      className="min-h-screen font-sans text-white overflow-x-hidden no-select relative"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <WorldBackground />

      {/* Language Selector */}
      <div className="fixed top-3 right-3 z-50">
        <LanguageSelector />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <HomeScreen
                stats={stats}
                streak={streak}
                freezes={freezes}
                maxFreezes={MAX_FREEZES}
                freezeCost={FREEZE_COST_XP}
                onBuyFreeze={handleBuyFreeze}
                daily={dailyToday}
                onPlayDaily={handleStartDaily}
                quests={questsToday}
                onNavigate={setScreen}
              />
            </motion.div>
          )}
          {screen === 'name-entry' && (
            <motion.div key="name-entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <NameEntry onSubmit={handleNameSubmit} onBack={() => setScreen('home')} />
            </motion.div>
          )}
          {screen === 'mode-select' && (
            <motion.div key="mode-select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ModeSelect stats={stats} onStart={handleStartGame} onBack={() => setScreen('home')} />
            </motion.div>
          )}
          {screen === 'game' && gameState && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <GameScreen
                gameState={gameState}
                currentQuestion={currentQuestion}
                selectedAnswer={selectedAnswer}
                isCorrect={isCorrect}
                showResult={showResult}
                chronoTimeLeft={chronoTimeLeft}
                onAnswer={handleAnswer}
                onNext={handleNext}
                onQuit={handleQuitGame}
              />
            </motion.div>
          )}
          {screen === 'game-over' && gameState && (
            <motion.div key="game-over" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <GameOver
                gameState={gameState}
                playerLevel={stats.level}
                playerXP={stats.xp}
                isNewBest={isNewBest}
                onPlayAgain={handlePlayAgain}
                onHome={() => setScreen('home')}
              />
            </motion.div>
          )}
          {screen === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <StatsScreen stats={stats} onBack={() => setScreen('home')} />
            </motion.div>
          )}
          {screen === 'passport' && (
            <motion.div key="passport" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <PassportScreen passport={passport} onBack={() => setScreen('home')} />
            </motion.div>
          )}
          {screen === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ProfileScreen stats={stats} onBack={() => setScreen('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Assistant - always visible */}
      <ChatAssistant />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
