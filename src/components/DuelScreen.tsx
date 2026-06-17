import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, MapPin, HelpCircle } from 'lucide-react';
import { Question } from '../types';
import { generateDuelQuestions, saveDuelResult } from '../utils/duel';
import { atlasLevel, atlasDelayMs, atlasSuccessRate, atlasWeakness, getAtlasPhrase } from '../data/atlas';
import { getCountryDisplayName, getCountryHint, countries } from '../data/countries';
import { countryShapes } from '../data/countryShapes';
import { useLanguage } from '../contexts/LanguageContext';
import { playCorrect, playWrong } from '../utils/sound';
import { haptics } from '../utils/haptics';
import FlagImg from './FlagImg';
import MonumentImage from './MonumentImage';
import AtlasAvatar from './AtlasAvatar';

const TOTAL = 10;
const QUESTION_TIMEOUT = 12000;
const MAX_SCORE = TOTAL * 2;

function codeOf(name: string) {
  return countries.find(c => c.name === name)?.code?.toLowerCase() || '';
}

interface Props {
  playerLevel: number;
  onExit: () => void;
}

export default function DuelScreen({ playerLevel, onExit }: Props) {
  const { t, language } = useLanguage();
  const level = atlasLevel(playerLevel);

  const [questions] = useState<Question[]>(() => generateDuelQuestions(TOTAL));
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'play' | 'reveal' | 'done'>('play');
  const [pPick, setPPick] = useState<string | null>(null);
  const [aPick, setAPick] = useState<string | null>(null);
  const [pScore, setPScore] = useState(0);
  const [aScore, setAScore] = useState(0);
  const [reaction, setReaction] = useState<{ id: number; text: string } | null>(null);
  const [expression, setExpression] = useState<'normal' | 'combo' | 'duelLoss' | 'laugh' | 'wow'>('normal');

  const startRef = useRef(0);
  const pTimeRef = useRef<number | null>(null);
  const aTimeRef = useRef<number | null>(null);
  const pPickRef = useRef<string | null>(null);
  const aPickRef = useRef<string | null>(null);
  const resolvedRef = useRef(false);
  const atlasTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const timeoutTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reactSeq = useRef(0);

  const q = questions[idx];

  const react = useCallback((text: string, exp: typeof expression = 'normal') => {
    reactSeq.current += 1;
    setReaction({ id: reactSeq.current, text });
    setExpression(exp);
  }, []);

  // Résolution d'une question : score + réactions, puis passage à la suivante
  const resolve = useCallback(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    if (atlasTimer.current) clearTimeout(atlasTimer.current);
    if (timeoutTimer.current) clearTimeout(timeoutTimer.current);

    const correct = q.correctAnswer;
    const pCorrect = pPickRef.current === correct;
    const aCorrect = aPickRef.current === correct;

    if (pCorrect) { playCorrect(0); haptics.correct(); } else { playWrong(); haptics.wrong(); }

    // Réactions de fin de question
    if (!pCorrect) react('Vraiment ?? C’était classique...', 'laugh');
    else if (!aCorrect) react('J’avais dit ça pour te tester.', 'normal');

    // Points : 1 par bonne réponse, +1 bonus au plus rapide parmi les corrects
    let pAdd = pCorrect ? 1 : 0;
    let aAdd = aCorrect ? 1 : 0;
    if (pCorrect || aCorrect) {
      const pt = pCorrect ? (pTimeRef.current ?? Infinity) : Infinity;
      const at = aCorrect ? (aTimeRef.current ?? Infinity) : Infinity;
      if (pt <= at) pAdd += 1; else aAdd += 1;
    }
    setPScore(s => s + pAdd);
    setAScore(s => s + aAdd);

    setPhase('reveal');
    nextTimer.current = setTimeout(() => {
      if (idx + 1 >= TOTAL) setPhase('done');
      else setIdx(i => i + 1);
    }, 1900);
  }, [q, idx, react]);

  // Mise en place de chaque question
  useEffect(() => {
    if (phase === 'done') return;
    resolvedRef.current = false;
    pPickRef.current = null;
    aPickRef.current = null;
    pTimeRef.current = null;
    aTimeRef.current = null;
    setPPick(null);
    setAPick(null);
    setPhase('play');
    setReaction(null);
    setExpression('normal');
    startRef.current = Date.now();

    const weak = atlasWeakness(q.country.continent);
    const delay = atlasDelayMs(level) + weak.extraMs;
    const rate = Math.max(0.05, atlasSuccessRate(level) - weak.ratePenalty);
    const willBeCorrect = Math.random() < rate;
    const wrongOpt = q.options.find(o => o !== q.correctAnswer) || q.correctAnswer;
    const atlasAnswer = willBeCorrect ? q.correctAnswer : wrongOpt;

    atlasTimer.current = setTimeout(() => {
      aPickRef.current = atlasAnswer;
      aTimeRef.current = Date.now() - startRef.current;
      setAPick(atlasAnswer);
      if (pPickRef.current === null) react('Trop lent ! 😏', 'combo');
    }, delay);

    // Filet de sécurité : si le joueur ne répond pas
    timeoutTimer.current = setTimeout(() => {
      if (pPickRef.current === null) { pPickRef.current = '__timeout__'; setPPick('__timeout__'); }
      if (aPickRef.current === null) { aPickRef.current = q.correctAnswer; aTimeRef.current = QUESTION_TIMEOUT; setAPick(q.correctAnswer); }
      resolve();
    }, QUESTION_TIMEOUT);

    return () => {
      if (atlasTimer.current) clearTimeout(atlasTimer.current);
      if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // Dès que les deux ont répondu → on résout
  useEffect(() => {
    if (phase === 'play' && pPick !== null && aPick !== null) resolve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pPick, aPick]);

  // Fin du duel : enregistrement + réaction finale d'ATLAS
  useEffect(() => {
    if (phase !== 'done') return;
    saveDuelResult(pScore, aScore);
    const won = pScore > aScore;
    react(getAtlasPhrase(won ? 'duelWin' : 'duelLose', level), won ? 'duelLoss' : 'combo');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => { if (nextTimer.current) clearTimeout(nextTimer.current); }, []);

  const onPick = (option: string) => {
    if (phase !== 'play' || pPickRef.current !== null) return;
    pTimeRef.current = Date.now() - startRef.current;
    pPickRef.current = option;
    setPPick(option);
    if (aPickRef.current === null) react('Ok t’es chaud aujourd’hui.', 'normal');
  };

  // ——— Écran de fin ———
  if (phase === 'done') {
    const won = pScore > aScore;
    const draw = pScore === aScore;
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-16">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-4">
            <AtlasAvatar expression={won ? 'duelLoss' : 'combo'} size={84} />
          </div>
          <h2 className={`text-3xl font-black mb-1 ${won ? 'text-emerald-400' : draw ? 'text-slate-200' : 'text-red-400'}`}>
            {won ? t.duel_you_win : draw ? t.duel_draw : t.duel_atlas_win}
          </h2>
          <div className="my-6 flex items-center justify-center gap-6">
            <div>
              <p className="text-5xl font-black text-white">{pScore}</p>
              <p className="text-xs text-slate-400 mt-1">{t.duel_you}</p>
            </div>
            <span className="text-2xl text-slate-500 font-bold">—</span>
            <div>
              <p className="text-5xl font-black text-indigo-300">{aScore}</p>
              <p className="text-xs text-slate-400 mt-1">ATLAS</p>
            </div>
          </div>
          {reaction && (
            <p className="mb-6 text-sm text-indigo-200 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl px-4 py-3">
              « {reaction.text} »
            </p>
          )}
          <div className="space-y-3">
            <button onClick={() => window.location.reload()} className="hidden" aria-hidden />
            <button
              onClick={onExit}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl"
            >
              {t.go_home}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const showResult = phase === 'reveal';
  const code = q.country.code?.toLowerCase() || '';

  return (
    <div className="min-h-dvh flex flex-col px-4 py-4 pt-14 max-w-[480px] mx-auto w-full">
      {/* Barre du haut : quitter + duel */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onExit} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400">
          <X className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-white">⚔️ {t.duel_mode} · {idx + 1}/{TOTAL}</span>
        <div className="w-10" />
      </div>

      {/* Deux barres de progression côte à côte : toi vs ATLAS */}
      <div className="flex gap-2 mb-4">
        {[{ label: t.duel_you, score: pScore, grad: 'from-emerald-400 to-teal-500', txt: 'text-emerald-300' },
          { label: 'ATLAS', score: aScore, grad: 'from-indigo-400 to-purple-500', txt: 'text-indigo-300' }].map(side => (
          <div key={side.label} className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-300">{side.label}</span>
              <span className={`text-sm font-black ${side.txt}`}>{side.score}</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div className={`h-full bg-gradient-to-r ${side.grad} rounded-full`}
                animate={{ width: `${(side.score / MAX_SCORE) * 100}%` }} transition={{ duration: 0.4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Avatar + réaction */}
      <div className="flex items-center gap-2 mb-2 min-h-[60px]">
        <AtlasAvatar expression={expression} size={48} />
        <AnimatePresence mode="wait">
          {reaction && (
            <motion.div key={reaction.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl rounded-bl-sm px-3 py-1.5 max-w-[230px]">
              <p className="text-[12px] text-slate-100 leading-snug">{reaction.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full text-center">
          {q.type === 'flag' && (
            <FlagImg code={code} emoji={q.country.flag} cdnWidth={320} emojiSize={80}
              className="rounded-lg shadow-2xl border border-white/10 mx-auto" style={{ width: 'min(260px,68vw)', height: 'auto' }} />
          )}
          {q.type === 'capital' && (
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <MapPin className="w-5 h-5 text-indigo-300" />
              <span className="text-2xl font-bold text-white">{q.country.capital}</span>
            </div>
          )}
          {q.type === 'monument' && (
            <>
              <MonumentImage title={q.country.monumentWiki ?? q.country.monument!} />
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                <span className="text-2xl">🗽</span>
                <span className="text-xl font-bold text-white">{q.country.monument}</span>
              </div>
            </>
          )}
          {q.type === 'hint' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mx-auto max-w-xs flex items-center gap-2 justify-center">
              <HelpCircle className="w-5 h-5 text-indigo-300 shrink-0" />
              <p className="text-base font-semibold text-indigo-200 italic">« {getCountryHint(q.country, q.hintIndex ?? 0, language)} »</p>
            </div>
          )}
          {q.type === 'shape' && countryShapes[q.country.name] && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 inline-block">
              <svg viewBox="0 0 100 100" className="w-36 h-36">
                <path d={countryShapes[q.country.name]} fill="rgba(99,102,241,0.2)" stroke="rgba(129,140,248,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          {q.type === 'flag' && <p className="text-slate-400 text-xs mt-3 flex items-center justify-center gap-1.5"><Flag className="w-4 h-4" /> {t.which_flag}</p>}

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5 mt-5">
            {q.options.map((option, i) => {
              let cls = 'bg-white/[0.04] border-white/10 text-white';
              if (showResult) {
                if (option === q.correctAnswer) cls = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300';
                else if (option === pPick) cls = 'bg-red-500/15 border-red-500/50 text-red-300';
                else cls = 'bg-white/[0.02] border-white/5 text-slate-600';
              } else if (option === pPick) {
                cls = 'bg-indigo-500/20 border-indigo-400/50 text-white';
              }
              const atlasOnThis = showResult && aPick === option;
              return (
                <button key={`${idx}-${option}`} onClick={() => onPick(option)} disabled={phase !== 'play' || pPick !== null}
                  className={`w-full p-3.5 rounded-2xl border-2 ${cls} font-semibold text-left flex items-center gap-3 transition-all`}>
                  <span className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {q.type !== 'flag' && <FlagImg code={codeOf(option)} emoji="🏳️" emojiSize={18} className="flag-img" style={{ width: 24, height: 17 }} />}
                  <span className="flex-1 truncate text-sm">{getCountryDisplayName(option, language)}</span>
                  {atlasOnThis && <span className="text-[11px] font-bold text-indigo-300 shrink-0">ATLAS</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
