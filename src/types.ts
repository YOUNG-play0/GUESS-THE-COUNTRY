export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'legendary';

/** Échelle des difficultés, du plus simple au plus dur */
export const DIFFICULTY_LADDER: Difficulty[] = ['easy', 'medium', 'hard', 'expert', 'legendary'];
export type GameMode = 'classic' | 'survival' | 'chrono' | 'map' | 'daily' | 'explorer';
export type Screen = 'home' | 'game' | 'stats' | 'profile' | 'mode-select' | 'game-over' | 'name-entry' | 'passport' | 'premium' | 'daily';
export type QuestionType = 'flag' | 'capital' | 'monument' | 'shape' | 'hint'
  // Mode Explorateur (Passe du Savoir)
  | 'currency' | 'language' | 'population' | 'area';

export interface Country {
  name: string;
  /** Nom du pays en français (le nom anglais reste la clé interne du jeu) */
  nameFr: string;
  code: string;
  flag: string;
  capital: string;
  continent: string;
  difficulty: Difficulty;
  /** Mode Explorateur : monnaie, langue principale, population (millions), superficie (km²) */
  currency: string;
  currencyFr: string;
  language: string;
  languageFr: string;
  population: number;
  area: number;
  hints: string[];
  /** Indices en français (même ordre que hints) */
  hintsFr?: string[];
  monument?: string;
  /** Titre de l'article Wikipédia du monument, si différent de son nom affiché */
  monumentWiki?: string;
}

export interface Question {
  type: QuestionType;
  country: Country;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
  /** Index de l'indice dans country.hints — résolu à l'affichage selon la langue */
  hintIndex?: number;
  blurred?: boolean;
  zoomed?: boolean;
}

export interface PlayerStats {
  name: string;
  totalGames: number;
  totalScore: number;
  bestScore: number;
  bestCombo: number;
  correctAnswers: number;
  totalAnswers: number;
  xp: number;
  level: number;
  gamesPerMode: Record<GameMode, number>;
  /** Meilleur score par mode — le « fantôme » à battre pendant la partie */
  bestScorePerMode: Partial<Record<GameMode, number>>;
  unlockedDifficulties: Difficulty[];
}

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  combo: number;
  bestCombo: number;
  multiplier: number;
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
  maxTime: number;
  lives: number;
  xpEarned: number;
  questionsAnswered: number;
  correctAnswers: number;
  isActive: boolean;
  isPaused: boolean;
  /** Pays correctement devinés pendant la partie (passeport) */
  correctCountries: string[];
  /** Bonnes réponses par continent (quêtes) */
  correctByContinent: Record<string, number>;
  /** Bonnes réponses aux questions drapeau (quêtes) */
  correctFlags: number;
}

export const XP_LEVELS = [
  { level: 1, xp: 0, title: 'Novice' },
  { level: 2, xp: 150, title: 'Curieux' },
  { level: 3, xp: 350, title: 'Explorateur' },
  { level: 4, xp: 600, title: 'Voyageur' },
  { level: 5, xp: 1000, title: 'Globe-Trotter' },
  { level: 6, xp: 1500, title: 'Cartographe' },
  { level: 7, xp: 2200, title: 'Navigateur' },
  { level: 8, xp: 3000, title: 'Géographe' },
  { level: 9, xp: 4000, title: 'Expert mondial' },
  { level: 10, xp: 5500, title: "Maître de l'Atlas" },
  { level: 11, xp: 7500, title: 'Légende' },
  { level: 12, xp: 10000, title: 'Grand Explorateur' },
  { level: 13, xp: 14000, title: 'Maître du Monde' },
  { level: 14, xp: 20000, title: 'Dominateur' },
  { level: 15, xp: 30000, title: 'Dieu de la Géographie' },
];

export function levelForXP(xp: number): number {
  let level = 1;
  for (const l of XP_LEVELS) {
    if (xp >= l.xp) level = l.level;
  }
  return level;
}

export const DIFFICULTY_TIMERS: Record<Difficulty, number> = {
  easy: 12,
  medium: 10,
  hard: 8,
  expert: 6,
  legendary: 5,
};
