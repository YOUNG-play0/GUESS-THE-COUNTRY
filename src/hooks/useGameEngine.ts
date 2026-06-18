import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, GameMode, Difficulty, Question, QuestionType, DIFFICULTY_TIMERS, Country } from '../types';
import { countries, getRandomCountries } from '../data/countries';
import { countryShapes } from '../data/countryShapes';
import { recordAdaptiveAnswer } from '../utils/adaptive';
import { prepareMonumentImage } from '../utils/monumentImage';

const MONUMENT_PREP_BUDGET_MS = 3000;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(country: Country, difficulty: Difficulty, mode: GameMode, allowMonument = true): Question {
  const questionTypes: QuestionType[] = [];

  if (mode === 'map') {
    questionTypes.push('shape');
  } else if (mode === 'explorer') {
    // Mode Explorateur (Passe du Savoir) : monnaies, langues, populations, superficies
    questionTypes.push('currency', 'language', 'population', 'area');
  } else {
    questionTypes.push('flag', 'capital');
    if (country.monument && allowMonument) {
      questionTypes.push('monument');
    }
    if (difficulty === 'hard' || difficulty === 'expert' || difficulty === 'legendary') {
      questionTypes.push('hint', 'shape');
    }
    if (difficulty === 'medium') {
      questionTypes.push('hint');
    }
  }

  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  // Questions comparatives : la bonne réponse est le plus grand des 4 pays
  if (type === 'population' || type === 'area') {
    const metric = (c: Country) => type === 'population' ? c.population : c.area;
    const others = getRandomCountries(3, undefined, [country.name]);
    const four = [country, ...others];
    const winner = four.reduce((a, b) => metric(b) > metric(a) ? b : a);
    return {
      type,
      country: winner,
      options: shuffleArray(four.map(c => c.name)),
      correctAnswer: winner.name,
    };
  }

  // Monnaies et langues partagées (euro, espagnol…) : les mauvaises options
  // ne doivent pas partager l'attribut de la bonne réponse
  let wrongPool: Country[] | undefined;
  if (type === 'currency') {
    wrongPool = countries.filter(c => c.currency !== country.currency);
  } else if (type === 'language') {
    wrongPool = countries.filter(c => c.language !== country.language);
  }
  const wrongCountries = wrongPool
    ? shuffleArray(wrongPool).slice(0, 3)
    : getRandomCountries(3, undefined, [country.name]);
  const options = shuffleArray([country.name, ...wrongCountries.map(c => c.name)]);
  const correctAnswer = country.name;
  let hintIndex: number | undefined;
  let blurred = false;
  let zoomed = false;

  if (type === 'hint') {
    // On stocke l'index : le texte est résolu à l'affichage selon la langue
    hintIndex = Math.floor(Math.random() * country.hints.length);
    if (difficulty === 'hard') blurred = true;
    if (difficulty === 'expert' || difficulty === 'legendary') { blurred = true; zoomed = true; }
  }

  return { type, country, options, correctAnswer, hintIndex, blurred, zoomed };
}

export interface GameOptions {
  /** Mode Explorateur : continents accessibles (Pack Continent) — undefined = tous */
  continents?: string[];
  /** Nombre max de questions monument par partie (gratuit) — undefined = illimité (Passe) */
  monumentCap?: number;
}

// Pays éligibles à un niveau de difficulté donné (mélange avec le niveau voisin)
const DIFFICULTY_POOLS: Record<Difficulty, Difficulty[]> = {
  easy: ['easy'],
  medium: ['easy', 'medium'],
  hard: ['medium', 'hard'],
  expert: ['hard', 'expert'],
  legendary: ['expert', 'legendary'],
};

// Tire un pays pour la difficulté COURANTE (les questions sont générées une
// à une : la difficulté adaptative peut changer en cours de partie).
function pickCountry(mode: GameMode, difficulty: Difficulty, used: Set<string>, opts?: GameOptions): Country {
  let pool: Country[];
  if (mode === 'map') {
    pool = countries.filter(c => countryShapes[c.name]);
  } else if (mode === 'explorer') {
    pool = opts?.continents
      ? countries.filter(c => opts.continents!.includes(c.continent))
      : countries;
  } else {
    pool = countries.filter(c => DIFFICULTY_POOLS[difficulty].includes(c.difficulty));
  }

  let available = pool.filter(c => !used.has(c.name));
  if (available.length === 0) {
    // Tout le niveau a été vu : on libère ce pool et on repart
    pool.forEach(c => used.delete(c.name));
    available = pool;
  }
  return available[Math.floor(Math.random() * available.length)];
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
  const gameOptsRef = useRef<GameOptions | undefined>(undefined);
  const usedCountriesRef = useRef<Set<string>>(new Set());
  const monumentsUsedRef = useRef(0);
  // Défi du jour : questions imposées, pas d'adaptation de difficulté
  const isPresetRef = useRef(false);
  // Préchargement des images monument : le timer est gelé tant qu'on prépare
  const [preparing, setPreparing] = useState(false);
  const prepareTokenRef = useRef(0);

  // Affiche une question ; pour un monument, précharge l'image AVANT de
  // lancer le timer (spinner neutre pendant ce temps). Si l'image n'est pas
  // prête sous 3 s, on bascule sur une question drapeau (même pays).
  const beginQuestion = useCallback((q: Question) => {
    const token = ++prepareTokenRef.current;
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
    answeredRef.current = false;

    if (q.type === 'monument' && q.country.monument && !q.imageUrl) {
      setPreparing(true);
      setCurrentQuestion(q); // l'écran montre un spinner neutre (aucun texte révélateur)
      const title = q.country.monumentWiki ?? q.country.monument;
      prepareMonumentImage(title, MONUMENT_PREP_BUDGET_MS).then(url => {
        if (token !== prepareTokenRef.current) return; // le joueur a déjà avancé
        if (url) {
          setCurrentQuestion({ ...q, imageUrl: url });
        } else {
          // Échec/lenteur : on remplace par une question drapeau du même pays
          setCurrentQuestion({ ...q, type: 'flag', imageUrl: undefined, hintIndex: undefined, blurred: false, zoomed: false });
        }
        questionStartRef.current = Date.now();
        setPreparing(false);
      });
    } else {
      setPreparing(false);
      setCurrentQuestion(q);
      questionStartRef.current = Date.now();
    }
  }, []);

  const makeQuestion = useCallback((mode: GameMode, difficulty: Difficulty): Question => {
    const country = pickCountry(mode, difficulty, usedCountriesRef.current, gameOptsRef.current);
    usedCountriesRef.current.add(country.name);
    const cap = gameOptsRef.current?.monumentCap;
    const allowMonument = cap === undefined || monumentsUsedRef.current < cap;
    const q = generateQuestion(country, difficulty, mode, allowMonument);
    if (q.type === 'monument') monumentsUsedRef.current++;
    return q;
  }, []);

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (chronoRef.current) { clearInterval(chronoRef.current); chronoRef.current = null; }
  }, []);

  const endGame = useCallback(() => {
    clearTimers();
    setGameState(prev => prev ? { ...prev, isActive: false } : prev);
  }, [clearTimers]);

  const startGame = useCallback((mode: GameMode, difficulty: Difficulty, presetQuestions?: Question[], opts?: GameOptions) => {
    clearTimers();
    gameOptsRef.current = opts;
    usedCountriesRef.current = new Set();
    monumentsUsedRef.current = 0;
    isPresetRef.current = !!presetQuestions;

    // Survie et Chrono n'ont pas de fin fixe (vies / temps) ; les questions
    // sont générées à la volée selon la difficulté adaptative courante.
    const totalQ = presetQuestions
      ? presetQuestions.length
      : mode === 'chrono' || mode === 'survival' ? Number.POSITIVE_INFINITY : 15;
    const maxTime = DIFFICULTY_TIMERS[difficulty];
    const qs = presetQuestions ?? [makeQuestion(mode, difficulty)];

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
      correctCountries: [],
      correctByContinent: {},
      correctFlags: 0,
    };

    setGameState(state);
    setQuestions(qs);
    if (mode === 'chrono') {
      setChronoTimeLeft(30);
    }
    beginQuestion(qs[0]); // gère le préchargement monument + le démarrage du timer
  }, [clearTimers, makeQuestion, beginQuestion]);

  // Per-question countdown timer (désactivé en Chrono : seul le chrono global compte)
  useEffect(() => {
    if (!gameState?.isActive || gameState.isPaused || showResult) return;
    if (preparing) return; // timer gelé pendant le préchargement de l'image
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
  }, [gameState?.isActive, gameState?.isPaused, gameState?.mode, showResult, gameState?.currentQuestion, preparing]);

  // Chrono global timer
  useEffect(() => {
    if (!gameState?.isActive || gameState.mode !== 'chrono' || gameState.isPaused) return;
    if (preparing) return; // gelé pendant le préchargement de l'image

    const interval = setInterval(() => {
      setChronoTimeLeft(prev => {
        const next = Math.round((prev - 0.1) * 10) / 10;
        return next <= 0 ? 0 : next;
      });
    }, 100);

    chronoRef.current = interval;
    return () => clearInterval(interval);
  }, [gameState?.isActive, gameState?.mode, gameState?.isPaused, preparing]);

  // Handle question time up
  useEffect(() => {
    if (!gameState || gameState.timeLeft > 0 || !gameState.isActive || answeredRef.current) return;
    // Auto-answer timeout
    answeredRef.current = true;
    setSelectedAnswer('__timeout__');
    setIsCorrect(false);
    setShowResult(true);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }

    // Un timeout compte comme une erreur pour la difficulté adaptative
    const nextDifficulty = isPresetRef.current
      ? gameState.difficulty
      : recordAdaptiveAnswer(false).difficulty;

    setGameState(prev => {
      if (!prev) return prev;
      const newLives = prev.mode === 'survival' ? prev.lives - 1 : prev.lives;
      return {
        ...prev,
        combo: 0,
        multiplier: 1,
        questionsAnswered: prev.questionsAnswered + 1,
        lives: newLives,
        difficulty: nextDifficulty,
        maxTime: DIFFICULTY_TIMERS[nextDifficulty],
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const answeredCountry = currentQuestion.country;
    const wasFlagQuestion = currentQuestion.type === 'flag';

    // Difficulté adaptative : suit les 10 dernières réponses, monte/descend en direct
    const nextDifficulty = isPresetRef.current
      ? gameState.difficulty
      : recordAdaptiveAnswer(correct).difficulty;

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
        difficulty: nextDifficulty,
        maxTime: DIFFICULTY_TIMERS[nextDifficulty],
        correctCountries: correct ? [...prev.correctCountries, answeredCountry.name] : prev.correctCountries,
        correctByContinent: correct
          ? { ...prev.correctByContinent, [answeredCountry.continent]: (prev.correctByContinent[answeredCountry.continent] ?? 0) + 1 }
          : prev.correctByContinent,
        correctFlags: prev.correctFlags + (correct && wasFlagQuestion ? 1 : 0),
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

    // Génération paresseuse : la question suivante est créée au moment voulu,
    // avec la difficulté adaptative COURANTE.
    if (!isPresetRef.current && nextIdx >= qs.length && nextIdx < gameState.totalQuestions) {
      qs = [...qs, makeQuestion(gameState.mode, gameState.difficulty)];
      setQuestions(qs);
    }

    if (nextIdx >= qs.length || nextIdx >= gameState.totalQuestions) {
      endGame();
      return;
    }

    setGameState(prev => prev ? {
      ...prev,
      currentQuestion: nextIdx,
      timeLeft: prev.maxTime,
    } : prev);
    beginQuestion(qs[nextIdx]); // préchargement monument + (re)démarrage du timer
  }, [gameState, questions, endGame, makeQuestion, beginQuestion]);

  return {
    gameState,
    currentQuestion,
    selectedAnswer,
    isCorrect,
    showResult,
    chronoTimeLeft,
    preparing,
    startGame,
    handleAnswer,
    nextQuestion,
    endGame,
    clearTimers,
  };
}
