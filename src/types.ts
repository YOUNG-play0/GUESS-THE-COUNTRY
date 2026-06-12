export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type GameMode = 'classic' | 'survival' | 'chrono' | 'map' | 'daily';
export type Screen = 'home' | 'game' | 'stats' | 'profile' | 'mode-select' | 'game-over' | 'name-entry' | 'passport' | 'premium';
export type QuestionType = 'flag' | 'capital' | 'monument' | 'shape' | 'hint';

export interface Country {
  name: string;
  /** Nom du pays en français (le nom anglais reste la clé interne du jeu) */
  nameFr: string;
  code: string;
  flag: string;
  capital: string;
  continent: string;
  difficulty: Difficulty;
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
  { level: 2, xp: 100, title: 'Explorer' },
  { level: 3, xp: 250, title: 'Voyageur' },
  { level: 4, xp: 500, title: 'Globe-Trotter' },
  { level: 5, xp: 800, title: 'Cartographer' },
  { level: 6, xp: 1200, title: 'Navigator' },
  { level: 7, xp: 1800, title: 'World Expert' },
  { level: 8, xp: 2500, title: 'Geography Master' },
  { level: 9, xp: 3500, title: 'Atlas Legend' },
  { level: 10, xp: 5000, title: 'World Dominator' },
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
};
