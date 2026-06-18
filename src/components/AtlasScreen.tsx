import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Lock, Swords, Crown } from 'lucide-react';
import AtlasAvatar from './AtlasAvatar';
import { atlasLevel } from '../data/atlas';
import { relationInfo, RELATION_TONE } from '../data/atlasRelation';
import { getFriendship, loadChatHistory, appendChat } from '../utils/atlasFriend';
import { loadDuelHistory, duelStats } from '../utils/duel';
import { sendAtlasMessage, remainingMessages, AtlasChatError, type ChatMessage } from '../utils/atlasChat';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  playerLevel: number;
  isPremium: boolean;
  streak: number;
  continentStats: Record<string, number>;
  onPremium: () => void;
  onBack: () => void;
}

const TIER_LABELS: Record<string, keyof import('../i18n/translations').Translations> = {
  stranger: 'rel_stranger', rival: 'rel_rival', friendlyRival: 'rel_friendly_rival',
  friend: 'rel_friend', bestFriend: 'rel_best_friend', legend: 'rel_legend',
};

export default function AtlasScreen({ playerLevel, isPremium, streak, continentStats, onPremium, onBack }: Props) {
  const { t } = useLanguage();
  const level = atlasLevel(playerLevel);
  const stats = duelStats();
  const history = loadDuelHistory().slice(0, 5);
  const winRate = stats.played ? Math.round((stats.won / stats.played) * 100) : 0;
  const atlasWins = Math.max(0, stats.played - stats.won);
  const friendship = getFriendship();
  const rel = relationInfo(friendship);

  // Mémoire persistante : on reprend la conversation où elle s'est arrêtée
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory() as ChatMessage[]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [remaining, setRemaining] = useState(remainingMessages());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    const userMsg: ChatMessage = { role: 'user', content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    appendChat('user', text);
    setSending(true);
    try {
      const h = new Date().getHours();
      const timeOfDay = h < 12 ? 'matin' : h < 18 ? 'après-midi' : 'soir';
      const reply = await sendAtlasMessage(text, {
        playerLevel, atlasLevel: level, streak, continentStats, relationTone: RELATION_TONE[rel.tier], timeOfDay,
      }, messages.slice(-10));
      setMessages([...nextHistory, { role: 'assistant', content: reply }]);
      appendChat('assistant', reply);
      setRemaining(remainingMessages());
    } catch (e) {
      const code = e instanceof AtlasChatError ? e.message : 'server';
      const fallback =
        code === 'limit' ? t.atlas_chat_limit
        : code === 'unavailable' || code === 'network' ? t.atlas_chat_offline
        : t.atlas_chat_error;
      setMessages([...nextHistory, { role: 'assistant', content: fallback }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-dvh px-4 pt-16 pb-36">
      <div className="w-full max-w-[480px] mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors py-2">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>

        {/* En-tête ATLAS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="flex justify-center mb-2"><AtlasAvatar expression="normal" size={88} /></div>
          <h2 className="text-2xl font-black text-white">ATLAS</h2>
          <p className="text-indigo-300 text-sm">{t.atlas_subtitle}</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-bold">{t.level_title} {level}/15</span>
          </div>
        </motion.div>

        {/* Jauge d'amitié */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-bold text-sm flex items-center gap-1.5">
              <span className="select-none">{rel.emoji}</span> {t[TIER_LABELS[rel.tier]]}
            </span>
            <span className="text-indigo-300 text-xs font-bold">{friendship}/100</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-indigo-400 rounded-full"
              initial={{ width: 0 }} animate={{ width: `${friendship}%` }} transition={{ duration: 0.8 }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">{t.atlas_friendship_hint}</p>
        </motion.div>

        {/* Tableau des scores : toi vs ATLAS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Swords className="w-4 h-4 text-fuchsia-400" /> {t.atlas_duels}</h3>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="text-center"><p className="text-3xl font-black text-emerald-400">{stats.won}</p><p className="text-[10px] text-slate-400 uppercase">{t.duel_you}</p></div>
            <span className="text-slate-500 font-bold">—</span>
            <div className="text-center"><p className="text-3xl font-black text-indigo-300">{atlasWins}</p><p className="text-[10px] text-slate-400 uppercase">ATLAS</p></div>
            <span className="text-slate-600">·</span>
            <div className="text-center"><p className="text-3xl font-black text-white">{winRate}%</p><p className="text-[10px] text-slate-400 uppercase">{t.atlas_winrate}</p></div>
          </div>
          {history.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {history.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className={r.won ? 'text-emerald-400' : 'text-red-400'}>{r.won ? '✓ ' + t.duel_you_win : '✕ ' + t.duel_atlas_win}</span>
                  <span className="text-slate-400 font-mono">{r.playerScore} — {r.atlasScore}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Conversation libre (Premium) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            💬 {t.atlas_chat_title}
            {isPremium && <span className="ml-auto text-[10px] text-slate-400">{remaining}/50</span>}
          </h3>

          {!isPremium ? (
            <button onClick={onPremium} className="w-full py-6 rounded-xl border border-dashed border-yellow-500/30 bg-yellow-500/5 flex flex-col items-center gap-2 hover:bg-yellow-500/10 transition-all">
              <Lock className="w-5 h-5 text-yellow-400/70" />
              <span className="text-yellow-200/80 text-xs font-semibold text-center px-4">{t.atlas_chat_premium}</span>
            </button>
          ) : (
            <>
              <div ref={scrollRef} className="max-h-72 overflow-y-auto space-y-2 mb-3">
                {messages.length === 0 && (
                  <p className="text-slate-500 text-xs text-center py-4">{t.atlas_chat_hint}</p>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-[13px] ${
                      m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                    }`}>{m.content}</div>
                  </div>
                ))}
                {sending && <div className="flex justify-start"><div className="bg-slate-800 text-slate-400 px-3 py-2 rounded-2xl rounded-bl-sm text-[13px]">…</div></div>}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder={t.atlas_chat_placeholder}
                  disabled={sending || remaining <= 0}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-400/50"
                />
                <button onClick={send} disabled={sending || !input.trim() || remaining <= 0} className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center disabled:opacity-40">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
