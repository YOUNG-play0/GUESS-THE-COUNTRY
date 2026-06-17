import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Lock, Swords, Crown } from 'lucide-react';
import AtlasAvatar from './AtlasAvatar';
import { atlasLevel } from '../data/atlas';
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

export default function AtlasScreen({ playerLevel, isPremium, streak, continentStats, onPremium, onBack }: Props) {
  const { t } = useLanguage();
  const level = atlasLevel(playerLevel);
  const stats = duelStats();
  const history = loadDuelHistory().slice(0, 5);
  const winRate = stats.played ? Math.round((stats.won / stats.played) * 100) : 0;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
    setSending(true);
    try {
      const reply = await sendAtlasMessage(text, {
        playerLevel, atlasLevel: level, streak, continentStats,
      }, messages);
      setMessages([...nextHistory, { role: 'assistant', content: reply }]);
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

        {/* Stats des duels */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Swords className="w-4 h-4 text-fuchsia-400" /> {t.atlas_duels}</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-2xl font-black text-white">{stats.played}</p><p className="text-[10px] text-slate-400 uppercase">{t.atlas_duels_played}</p></div>
            <div><p className="text-2xl font-black text-emerald-400">{stats.won}</p><p className="text-[10px] text-slate-400 uppercase">{t.atlas_duels_won}</p></div>
            <div><p className="text-2xl font-black text-indigo-300">{winRate}%</p><p className="text-[10px] text-slate-400 uppercase">{t.atlas_winrate}</p></div>
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
