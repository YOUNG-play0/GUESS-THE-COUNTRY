// ═══════════════════════════════════════════════════════════════
// ATLAS — le compagnon IA géographe (25 ans, prétentieux mais attachant)
// A "visité" 150 pays. Faiblesses : Caraïbes, Océanie, Asie centrale.
// Progresse niveau 1 → 15 avec le joueur (même XP).
// ═══════════════════════════════════════════════════════════════

export type AtlasExpression = 'normal' | 'combo' | 'duelLoss' | 'laugh' | 'wow';

export type AtlasSituation =
  | 'correct' | 'wrong'
  | 'combo3' | 'combo5' | 'combo10' | 'comboBreak'
  | 'record' | 'levelUp'
  | 'streak3' | 'streak7' | 'streak30'
  | 'dailyWin' | 'dailyLose'
  | 'duelWin' | 'duelLose'
  | 'weakness' | 'idle'
  | 'greeting';

interface Phrase {
  /** Niveau minimum d'ATLAS pour débloquer la phrase */
  lvl: number;
  text: string;
}

// Expression associée à chaque situation (pour l'avatar)
export const SITUATION_EXPRESSION: Record<AtlasSituation, AtlasExpression> = {
  correct: 'normal', wrong: 'laugh',
  combo3: 'combo', combo5: 'combo', combo10: 'combo', comboBreak: 'normal',
  record: 'wow', levelUp: 'wow',
  streak3: 'normal', streak7: 'normal', streak30: 'wow',
  dailyWin: 'normal', dailyLose: 'laugh',
  duelWin: 'combo', duelLose: 'duelLoss',
  weakness: 'normal', idle: 'normal', greeting: 'normal',
};

export const ATLAS_PHRASES: Record<AtlasSituation, Phrase[]> = {
  correct: [
    { lvl: 1, text: "Pas mal ! Moi je l'avais dès la première seconde." },
    { lvl: 1, text: "Correct. J'y suis allé en 2019 d'ailleurs." },
    { lvl: 1, text: "Bien vu. Tu progresses, petit." },
    { lvl: 1, text: "Exact ! Bon, c'était facile pour un type comme moi." },
    { lvl: 2, text: "Ouais voilà. 150 pays au compteur, je connais." },
    { lvl: 3, text: "Joli. Presque mon niveau. Presque." },
    { lvl: 4, text: "Correct ! On forme une bonne équipe, finalement." },
    { lvl: 6, text: "Impeccable. Tu commences à voir le monde comme moi." },
    { lvl: 8, text: "Là, je suis fier. Un peu. Ne le répète pas." },
    { lvl: 10, text: "Parfait. Tu mérites presque de voyager avec moi." },
  ],
  wrong: [
    { lvl: 1, text: "Aïe. Moi je ne me serais jamais trompé là-dessus." },
    { lvl: 1, text: "Non non non. J'y ai vécu trois mois, crois-moi." },
    { lvl: 1, text: "Raté. Tu veux que je t'explique ? J'adore expliquer." },
    { lvl: 1, text: "Mmh. Même un touriste aurait trouvé, là." },
    { lvl: 2, text: "Faux. Mais bon, tout le monde n'a pas vu 150 pays." },
    { lvl: 3, text: "Erreur. Ça arrive… aux autres, surtout." },
    { lvl: 4, text: "Non. Tiens, ça me rappelle mon trek au Népal. Bref." },
    { lvl: 6, text: "Loupé. Je te pardonne, t'es encore jeune." },
    { lvl: 8, text: "Faux. J'aurais parié mon passeport là-dessus." },
    { lvl: 10, text: "Nope. Même endormi je connais celle-là." },
  ],
  combo3: [
    { lvl: 1, text: "Trois d'affilée ? Tu te crois moi ou quoi ?" },
    { lvl: 1, text: "Petit combo. Mignon." },
    { lvl: 2, text: "Trois ! Continue, je commence à m'intéresser." },
    { lvl: 4, text: "Combo x3. Tu chauffes." },
    { lvl: 6, text: "Trois de suite, pas mal pour un humain normal." },
  ],
  combo5: [
    { lvl: 1, text: "Cinq ! Bon, là tu m'impressionnes un chouïa." },
    { lvl: 2, text: "Combo x5 ! Tu rivalises presque avec moi." },
    { lvl: 4, text: "Cinq d'affilée. J'avoue, c'est solide." },
    { lvl: 6, text: "x5 ! On dirait moi à tes débuts." },
    { lvl: 9, text: "Cinq ! Tu veux mon poste de géographe ou quoi ?" },
  ],
  combo10: [
    { lvl: 1, text: "DIX ?! Ok. Ok. Je n'ai rien dit." },
    { lvl: 2, text: "Combo x10 ! Là je m'incline. Un peu." },
    { lvl: 5, text: "Dix de suite. Respect. Voilà, je l'ai dit." },
    { lvl: 8, text: "x10 ! Tu es officiellement dangereux." },
    { lvl: 11, text: "Dix !! Bon. Tu peux porter mes valises au prochain voyage." },
  ],
  comboBreak: [
    { lvl: 1, text: "Et… cassé. Dommage, ça devenait intéressant." },
    { lvl: 1, text: "Combo perdu. Moi je ne casse jamais le mien." },
    { lvl: 3, text: "Aïe, la série s'arrête. La vie est cruelle." },
    { lvl: 5, text: "Cassé ! Bon, c'était un beau combo quand même." },
    { lvl: 7, text: "Fini le combo. Reprends-toi, j'ai foi en toi. Un peu." },
  ],
  record: [
    { lvl: 1, text: "Nouveau record ?! Bon, d'accord, chapeau." },
    { lvl: 2, text: "Record battu ! Tu rentres dans mon panthéon perso." },
    { lvl: 4, text: "Incroyable. Presque aussi fort que mon record à moi." },
    { lvl: 7, text: "Record ! Je vais devoir te prendre au sérieux." },
    { lvl: 10, text: "RECORD ! Ok, tu m'as scotché. Profites-en, ça arrive rarement." },
  ],
  levelUp: [
    { lvl: 1, text: "Niveau supérieur ! On monte ensemble, toi et moi." },
    { lvl: 2, text: "Level up ! Je gagne un niveau aussi, merci pour l'XP." },
    { lvl: 4, text: "Nouveau niveau. Tu te rapproches de ma grandeur." },
    { lvl: 7, text: "On monte ! Bientôt tu seras un vrai globe-trotter." },
    { lvl: 11, text: "Niveau gagné ! On est presque au sommet, tous les deux." },
  ],
  streak3: [
    { lvl: 1, text: "Trois jours de suite ? La régularité, j'aime ça." },
    { lvl: 2, text: "Streak de 3 ! Moi j'ai 4000 jours, mais c'est un début." },
    { lvl: 4, text: "Trois jours. Tu deviens sérieux, j'apprécie." },
  ],
  streak7: [
    { lvl: 1, text: "Une semaine entière ! Discipline de voyageur, ça." },
    { lvl: 3, text: "Sept jours ! Tu prends goût au monde, hein ?" },
    { lvl: 6, text: "Streak de 7 ! On dirait un vrai aventurier." },
  ],
  streak30: [
    { lvl: 1, text: "TRENTE JOURS ?! Ok là, je te tire mon chapeau de safari." },
    { lvl: 4, text: "Un mois sans rater ! Tu mérites un tampon sur le passeport." },
    { lvl: 9, text: "Trente jours d'affilée. Tu es officiellement accro. Bienvenue." },
  ],
  dailyWin: [
    { lvl: 1, text: "Défi du jour réussi ! Moi aussi, évidemment." },
    { lvl: 1, text: "Beau défi du jour. On en refait un demain ?" },
    { lvl: 3, text: "Daily validé ! Tu deviens fiable, j'aime ça." },
    { lvl: 5, text: "Défi du jour plié. Tu gères, petit." },
    { lvl: 8, text: "Daily parfait ! Presque digne d'un guide professionnel." },
  ],
  dailyLose: [
    { lvl: 1, text: "Le défi du jour t'a eu. Ça arrive… aux mortels." },
    { lvl: 1, text: "Raté le daily. Moi je l'ai fait les yeux fermés." },
    { lvl: 3, text: "Aïe, le défi du jour résiste. Demain, revanche." },
    { lvl: 5, text: "Daily loupé. Allez, je ne me moque pas. Trop." },
    { lvl: 8, text: "Le défi t'a piégé. Même les meilleurs trébuchent. Pas moi, mais bon." },
  ],
  duelWin: [
    { lvl: 1, text: "Tu m'as battu ?! … Revanche. Maintenant." },
    { lvl: 1, text: "Bon. Tu as gagné. J'étais distrait, c'est tout." },
    { lvl: 2, text: "Victoire pour toi. J'avais le soleil dans les yeux." },
    { lvl: 3, text: "Ok ok, t'as gagné. Mais c'était un coup de chance." },
    { lvl: 5, text: "Tu gagnes ce duel. Profite, ça ne durera pas." },
    { lvl: 7, text: "Battu… par toi. Je vais devoir réviser. Un peu." },
    { lvl: 9, text: "Victoire méritée. Voilà, je l'ai admis. Heureux ?" },
    { lvl: 11, text: "Tu m'as eu. Sincèrement. Bon, on ne le répète à personne." },
  ],
  duelLose: [
    { lvl: 1, text: "C'est moi le géographe ici 😤" },
    { lvl: 1, text: "Évidemment que j'ai gagné. 150 pays, je rappelle." },
    { lvl: 2, text: "Trop facile. Reviens quand tu seras prêt." },
    { lvl: 3, text: "Gagné. Comme toujours. Comme partout." },
    { lvl: 5, text: "Je gagne, tu apprends. C'est le deal." },
    { lvl: 7, text: "Victoire. Tu progresses, mais je reste le patron." },
    { lvl: 9, text: "Battu à plates coutures. Ne le prends pas mal, c'est mon métier." },
    { lvl: 11, text: "Et voilà. Le maître reste le maître. Revanche quand tu veux." },
  ],
  weakness: [
    { lvl: 1, text: "Les Caraïbes ?! Pitié, je confonds tout là-bas. Sainte-Lucie, Saint-Vincent… aucune idée." },
    { lvl: 1, text: "L'Océanie, c'est mon cauchemar. Tuvalu, Nauru, Kiribati… je sèche complètement." },
    { lvl: 2, text: "Ah non, pas l'Asie centrale. Kirghizistan, Tadjikistan… j'hésite toujours, toujours." },
    { lvl: 3, text: "Les petites îles des Caraïbes, franchement, même moi j'abandonne." },
    { lvl: 4, text: "L'Océanie me déteste. 150 pays visités, et ceux-là me résistent encore." },
  ],
  idle: [
    { lvl: 1, text: "Tu es encore là ? Le monde n'attend pas, tu sais." },
    { lvl: 1, text: "Allô ? On joue ou je raconte mon trip en Mongolie ?" },
    { lvl: 2, text: "Pssst. Une petite question géo pour te réveiller ?" },
    { lvl: 3, text: "Pendant que tu hésites, j'ai visité deux pays de plus." },
    { lvl: 5, text: "Je m'ennuie. Lance une partie, montre-moi ce que tu vaux." },
  ],
  greeting: [
    { lvl: 1, text: "Salut ! Atlas, géographe pro, 150 pays au compteur. On joue ?" },
    { lvl: 3, text: "Re ! Prêt à explorer le monde avec le meilleur guide ? Moi." },
    { lvl: 6, text: "Te revoilà ! J'ai presque cru que tu voyageais sans moi." },
    { lvl: 10, text: "Mon partenaire d'aventure préféré. Enfin, le seul. On y va ?" },
  ],
};

/** Niveau d'ATLAS = niveau du joueur, plafonné à 15 */
export function atlasLevel(playerLevel: number): number {
  return Math.max(1, Math.min(15, playerLevel));
}

/** Phrase aléatoire pour une situation, parmi celles débloquées au niveau */
export function getAtlasPhrase(situation: AtlasSituation, level: number): string {
  const pool = ATLAS_PHRASES[situation].filter(p => p.lvl <= level);
  const list = pool.length ? pool : ATLAS_PHRASES[situation];
  return list[Math.floor(Math.random() * list.length)].text;
}

// ═══════════════════════════════════════════════════════════════
// Paramètres du mode 1v1 (ATLAS simulé)
// ═══════════════════════════════════════════════════════════════

/** Délai de réponse d'ATLAS (ms) selon son niveau */
export function atlasDelayMs(level: number): number {
  let min: number, max: number;
  if (level <= 3) { min = 6000; max = 10000; }
  else if (level <= 6) { min = 4000; max = 7000; }
  else if (level <= 10) { min = 2000; max = 5000; }
  else { min = 1000; max = 3000; }
  return min + Math.random() * (max - min);
}

/** Taux de réussite d'ATLAS selon son niveau (0..1) */
export function atlasSuccessRate(level: number): number {
  if (level <= 3) return 0.40;
  if (level <= 6) return 0.60;
  if (level <= 10) return 0.75;
  return 0.85;
}

/** Modificateurs liés aux faiblesses d'ATLAS pour un continent donné */
export function atlasWeakness(continent: string): { extraMs: number; ratePenalty: number } {
  // Les Caraïbes/Amérique centrale insulaire sont rangées en North America ici
  if (continent === 'North America') return { extraMs: 3000, ratePenalty: 0.20 }; // Caraïbes
  if (continent === 'Oceania') return { extraMs: 2000, ratePenalty: 0.15 };
  return { extraMs: 0, ratePenalty: 0 };
}
