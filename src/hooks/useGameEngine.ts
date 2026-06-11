import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, GameMode, Difficulty, Question, QuestionType, DIFFICULTY_TIMERS, Country } from '../types';
import { countries, getRandomCountries } from '../data/countries';
import { countryShapes } from '../data/countryShapes';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(country: Country, difficulty: Difficulty, mode: GameMode): Question {
  const questionTypes: QuestionType[] = [];

  if (mode === 'map') {
    questionTypes.push('shape');
  } else {
    questionTypes.push('flag', 'capital');
    if (country.monument) {
      questionTypes.push('monument');
    }
    if (difficulty === 'hard' || difficulty === 'expert') {
      questionTypes.push('hint', 'shape');
    }
    if (difficulty === 'medium') {
      questionTypes.push('hint');
    }
  }

  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  const wrongCountries = getRandomCountries(3, undefined, [country.name]);
  const options = shuffleArray([country.name, ...wrongCountries.map(c => c.name)]);
  const correctAnswer = country.name;
  let hintIndex: number | undefined;
  let blurred = false;
  let zoomed = false;

  if (type === 'hint') {
    // On stocke l'index : le texte est résolu à l'affichage selon la langue
    hintIndex = Math.floor(Math.random() * country.hints.length);
    if (difficulty === 'hard') blurred = true;
    if (difficulty === 'expert') { blurred = true; zoomed = true; }
  }

  return { type, country, options, correctAnswer, hintIndex, blurred, zoomed };
}

function generateQuestions(mode: GameMode, difficulty: Difficulty, count: number): Question[] {
  let pool: Country[];

  if (mode === 'map') {
    const shapedCountries = countries.filter(c => countryShapes[c.name]);
    pool = shuffleArray(shapedCountries).slice(0, count);
  } else {
    const difficultyMap: Record<Difficulty, Difficulty[]> = {
      easy: ['easy'],
      medium: ['easy', 'medium'],
      hard: ['medium', 'hard'],
      expert: ['hard', 'expert'],
    };
    const allowedDiffs = difficultyMap[difficulty];
    pool = shuffleArray(
      countries.filter(c => allowedDiffs.includes(c.difficulty))
    ).slice(0, count);
  }

  if (pool.length < count) {
    const extra = shuffleArray(countries.filter(c => !pool.includes(c))).slice(0, count - pool.length);
    pool = [...pool, ...extra];
  }

  return pool.map(c => generateQuestion(c, difficulty, mode));
}

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [chronoTimeLeft, setChronoTimeLeft] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chronoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(0);
  const answeredRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (chronoRef.current) { clearInterval(chronoRef.current); chronoRef.current = null; }
  }, []);

  const endGame = useCallback(() => {
    clearTimers();
    setGameState(prev => prev ? { ...prev, isActive: false } : prev);
  }, [clearTimers]);

  const startGame = useCallback((mode: GameMode, difficulty: Difficulty) => {
    clearTimers();
    const totalQ = mode === 'chrono' ? 50 : mode === 'survival' ? 50 : 15;
    const maxTime = DIFFICULTY_TIMERS[difficulty];
    const qs = generateQuestions(mode, difficulty, totalQ);

    const state: GameState = {
      mode,
      difficulty,
      score: 0,
      combo: 0,
      bestCombo: 0,
      multiplier: 1,
      currentQuestion: 0,
      totalQuestions: totalQ,
      timeLeft: maxTime,
      maxTime,
      // Les vies n'existent qu'en mode Survie (le compteur n'est affiché que dans ce mode)
      lives: mode === 'survival' ? 1 : 0,
      xpEarned: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      isActive: true,
      isPaused: false,
    };

    setGameState(state);
    setQuestions(qs);
    setCurrentQuestion(qs[0]);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
    answeredRef.current = false;
    questionStartRef.current = Date.now();

    if (mode === 'chrono') {
      setChronoTimeLeft(30);
    }
  }, [clearTimers]);

  // Per-question countdown timer (désactivé en Chrono : seul le chrono global compte)
  useEffect(() => {
    if (!gameState?.isActive || gameState.isPaused || showResult) return;
    if (gameState.mode === 'chrono') return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev || !prev.isActive || answeredRef.current) return prev;
        const newTime = Math.round((prev.timeLeft - 0.1) * 10) / 10;
        if (newTime <= 0) {
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: newTime };
      });
    }, 100);

    timerRef.current = interval;
    return () => clearInterval(interval);
  }, [gameState?.isActive, gameState?.isPaused, gameState?.mode, showResult, gameState?.currentQuestion]);

  // Chrono global timer
  useEffect(() => {
    if (!gameState?.isActive || gameState.mode !== 'chrono' || gameState.isPaused) return;

    const interval = setInterval(() => {
      setChronoTimeLeft(prev => {
        const next = Math.round((prev - 0.1) * 10) / 10;
        return next <= 0 ? 0 : next;
      });
    }, 100);

    chronoRef.current = interval;
    return () => clearInterval(interval);
  }, [gameState?.isActive, gameState?.mode, gameState?.isPaused]);

  // Handle question time up
  useEffect(() => {
    if (!gameState || gameState.timeLeft > 0 || !gameState.isActive || answeredRef.current) return;
    // Auto-answer timeout
    answeredRef.current = true;
    setSelectedAnswer('__timeout__');
    setIsCorrect(false);
    setShowResult(true);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }

    setGameState(prev => {
      if (!prev) return prev;
      const newLives = prev.mode === 'survival' ? prev.lives - 1 : prev.lives;
      return {
        ...prev,
        combo: 0,
        multiplier: 1,
        questionsAnswered: prev.questionsAnswered + 1,
        lives: newLives,
      };
    });
  }, [gameState?.timeLeft, gameState?.isActive]);

  // Handle chrono end
  useEffect(() => {
    if (gameState?.mode === 'chrono' && chronoTimeLeft <= 0 && gameState.isActive) {
      endGame();
    }
  }, [chronoTimeLeft, gameState?.mode, gameState?.isActive, endGame]);

  const handleAnswer = useCallback((answer: string) => {
    if (!gameState || !currentQuestion || showResult || answeredRef.current) return;
    answeredRef.current = true;

    const correct = answer === currentQuestion.correctAnswer;
    const timeElapsed = (Date.now() - questionStartRef.current) / 1000;
    const speedBonus = correct ? Math.max(0, Math.floor((gameState.maxTime - timeElapsed) * 2)) : 0;

    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);

    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }

    setGameState(prev => {
      if (!prev) return prev;
      const newCombo = correct ? prev.combo + 1 : 0;
      let newMultiplier = 1;
      if (newCombo >= 10) newMultiplier = 5;
      else if (newCombo >= 7) newMultiplier = 4;
      else if (newCombo >= 5) newMultiplier = 3;
      else if (newCombo >= 3) newMultiplier = 2;

      const basePoints = correct ? 10 : 0;
      const points = (basePoints + speedBonus) * (correct ? newMultiplier : 1);
      const xpGain = correct ? 5 + Math.floor(speedBonus / 2) : 0;
      const newLives = correct ? prev.lives : prev.lives - (prev.mode === 'survival' ? 1 : 0);

      return {
        ...prev,
        score: prev.score + points,
        combo: newCombo,
        bestCombo: Math.max(prev.bestCombo, newCombo),
        multiplier: newMultiplier,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
        xpEarned: prev.xpEarned + xpGain,
        lives: newLives,
      };
    });
  }, [gameState, currentQuestion, showResult]);

  const nextQuestion = useCallback(() => {
    if (!gameState) return;

    // Check survival game over
    if (gameState.mode === 'survival' && gameState.lives <= 0) {
      endGame();
      return;
    }

    const nextIdx = gameState.currentQuestion + 1;
    let qs = questions;

    // En Survie, la partie ne s'arrête qu'à 0 vie : on régénère des
    // questions à la volée quand on approche de la fin du tableau.
    if (gameState.mode === 'survival' && nextIdx >= qs.length - 5) {
      qs = [...qs, ...generateQuestions(gameState.mode, gameState.difficulty, 25)];
      setQuestions(qs);
    }

    if (nextIdx >= qs.length) {
      endGame();
      return;
    }

    answeredRef.current = false;
    setGameState(prev => prev ? {
      ...prev,
      currentQuestion: nextIdx,
      timeLeft: prev.maxTime,
    } : prev);
    setCurrentQuestion(qs[nextIdx]);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
    questionStartRef.current = Date.now();
  }, [gameState, questions, endGame]);

  return {
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
  };
}
