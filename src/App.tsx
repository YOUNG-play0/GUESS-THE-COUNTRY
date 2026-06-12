import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Screen, GameMode, levelForXP } from './types';
import { getAdaptiveDifficulty } from './utils/adaptive';
import { BadgeDef } from './data/badges';
import BadgePopup from './components/BadgePopup';
import { isSoundEnabled, setSoundEnabled, playFanfare } from './utils/sound';
import { getStoredTheme, storeTheme, themeGradient, DEFAULT_THEME } from './utils/themes';
import { useStorage } from './hooks/useStorage';
import { useGameEngine } from './hooks/useGameEngine';
import { useProgress, FREEZE_COST_XP, MAX_FREEZES, todayKey } from './hooks/useProgress';
import { usePremium } from './hooks/usePremium';
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
import PremiumScreen from './components/PremiumScreen';
import DailyScreen from './components/DailyScreen';
import BottomNav from './components/BottomNav';
import ChatAssistant from './components/ChatAssistant';
import LanguageSelector from './components/LanguageSelector';

// En dessous de ce nombre de questions répondues, une partie quittée
// est considérée comme abandonnée et n'est pas comptée dans les stats.
const MIN_QUESTIONS_TO_RECORD = 3;

function AppContent() {
  const { isRTL } = useLanguage();
  const [screen, setScreen] = useState<Screen>('home');
  const [lastMode, setLastMode] = useState<GameMode>('classic');
  const gameRecordedRef = useRef(false);
  // Record AVANT la partie : sert au message « il te manquait X pts »
  // (stats.bestScore est déjà écrasé quand l'écran de fin s'affiche)
  const prevBestRef = useRef(0);
  // Duel fantôme : record du mode joué, figé au lancement de la partie
  const ghostRef = useRef(0);
  const {
    stats,
    addXP,
    spendXP,
    recordGame,
    setPlayerName,
  } = useStorage();

  const {
    streak, freezes, addFreeze,
    dailyToday, startDaily,
    questsToday, registerGameEnd, claimWeeklyFreeze, passport, badges, continentStats,
  } = useProgress();
  const [newBadges, setNewBadges] = useState<BadgeDef[]>([]);
  const [soundOn, setSoundOn] = useState(isSoundEnabled);
  const [theme, setTheme] = useState(getStoredTheme);
  const premium = usePremium();

  const handleSetTheme = useCallback((id: string) => {
    setTheme(id);
    storeTheme(id);
  }, []);

  // Passe du Savoir : gel de streak offert chaque semaine
  useEffect(() => {
    if (premium.isPremium) claimWeeklyFreeze();
  }, [premium.isPremium, claimWeeklyFreeze]);

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
      const { questXp, newBadges: unlocked } = registerGameEnd({
        mode: gameState.mode,
        score: gameState.score,
        bestCombo: gameState.bestCombo,
        correctAnswers: gameState.correctAnswers,
        questionsAnswered: gameState.questionsAnswered,
        correctByContinent: gameState.correctByContinent,
        correctFlags: gameState.correctFlags,
        correctCountries: gameState.correctCountries,
      }, {
        totalGames: stats.totalGames + 1,
        bestCombo: Math.max(stats.bestCombo, gameState.bestCombo),
        bestScore: Math.max(stats.bestScore, gameState.score),
        level: stats.level,
      }, premium.isPremium);
      if (questXp > 0) addXP(questXp);
      setNewBadges(unlocked);
      // Fanfare de niveau gagné (XP de la partie + XP des quêtes)
      if (levelForXP(stats.xp + gameState.xpEarned + questXp) > stats.level) {
        playFanfare();
      }
      setScreen('game-over');
    }
  }, [gameState?.isActive]);

  const handleStartGame = useCallback((mode: GameMode) => {
    setLastMode(mode);
    gameRecordedRef.current = false;
    prevBestRef.current = stats.bestScore;
    ghostRef.current = stats.bestScorePerMode?.[mode] ?? 0;
    const expCont = premium.explorerContinents();
    // Difficulté adaptative : calculée sur les 10 dernières réponses
    startGame(mode, getAdaptiveDifficulty(), undefined, {
      // Gratuit : 1 question monument max par partie (Passe = illimité)
      monumentCap: premium.isPremium ? undefined : 1,
      continents: mode === 'explorer' && expCont !== 'all' && expCont ? expCont : undefined,
    });
    setScreen('game');
  }, [startGame, stats.bestScore, stats.bestScorePerMode, premium]);

  const handleStartDaily = useCallback(() => {
    if (!stats.name) {
      setScreen('name-entry');
      return;
    }
    const qs = generateDailyQuestions(todayKey());
    startDaily(qs.length);
    gameRecordedRef.current = false;
    prevBestRef.current = stats.bestScore;
    ghostRef.current = stats.bestScorePerMode?.daily ?? 0;
    startGame('daily', 'medium', qs);
    setScreen('game');
  }, [stats.name, startDaily, startGame]);

  // Lien profond du raccourci PWA « Défi du jour » (manifest shortcuts)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('daily') === '1') {
      window.history.replaceState(null, '', window.location.pathname);
      if (stats.name && !dailyToday) handleStartDaily();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    handleStartGame(lastMode);
  }, [handleStartGame, lastMode]);

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
      className="min-h-screen w-full font-sans text-white overflow-x-hidden no-select relative"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Thèmes visuels : réservés au Passe du Savoir */}
      <WorldBackground gradient={themeGradient(premium.isPremium ? theme : DEFAULT_THEME)} />

      {/* Language Selector */}
      <div className="fixed top-3 right-3 z-50">
        <LanguageSelector />
      </div>

      {/* Interrupteur son */}
      <button
        onClick={() => { setSoundEnabled(!soundOn); setSoundOn(!soundOn); }}
        aria-label={soundOn ? 'Mute' : 'Unmute'}
        className="fixed top-3 left-3 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
      >
        {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full">
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
                quests={premium.isPremium ? questsToday : questsToday.filter(q => !q.premium)}
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
              <ModeSelect
                explorerUnlocked={premium.explorerContinents() !== null}
                onStart={handleStartGame}
                onPremium={() => setScreen('premium')}
                onBack={() => setScreen('home')}
              />
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
                ghostScore={ghostRef.current}
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
                previousBest={prevBestRef.current}
                onPlayAgain={handlePlayAgain}
                onHome={() => setScreen('home')}
              />
            </motion.div>
          )}
          {screen === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <StatsScreen
                stats={stats}
                continentStats={continentStats}
                passport={passport}
                isPremium={premium.isPremium}
                onPremium={() => setScreen('premium')}
                onBack={() => setScreen('home')}
              />
            </motion.div>
          )}
          {screen === 'passport' && (
            <motion.div key="passport" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <PassportScreen passport={passport} onBack={() => setScreen('home')} />
            </motion.div>
          )}
          {screen === 'daily' && (
            <motion.div key="daily" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <DailyScreen daily={dailyToday} onPlay={handleStartDaily} />
            </motion.div>
          )}
          {screen === 'premium' && (
            <motion.div key="premium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <PremiumScreen
                plan={premium.plan}
                trialDaysLeft={premium.trialDaysLeft}
                trialUsed={premium.trialUsed}
                continentPacks={premium.continentPacks}
                onStartTrial={premium.startTrial}
                onSubscribe={premium.subscribe}
                onBuyPack={premium.buyContinentPack}
                onBack={() => setScreen('home')}
              />
            </motion.div>
          )}
          {screen === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ProfileScreen
                stats={stats}
                badges={badges}
                isPremium={premium.isPremium}
                theme={theme}
                onSetTheme={handleSetTheme}
                onPremium={() => setScreen('premium')}
                onStats={() => setScreen('stats')}
                onBack={() => setScreen('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Barre de navigation fixe (écrans hub uniquement) */}
      {(['home', 'passport', 'daily', 'premium', 'stats', 'profile'] as Screen[]).includes(screen) && (
        <BottomNav current={screen} onNavigate={setScreen} />
      )}

      {/* Popup de succès débloqués (après une partie) */}
      <BadgePopup
        badges={screen === 'game-over' ? newBadges : []}
        onClose={() => setNewBadges([])}
      />

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
