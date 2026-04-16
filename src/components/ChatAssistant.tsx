import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Lightbulb, Award, ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ChatAssistant() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const helpTopics = [
    { icon: BookOpen, title: t.how_to_play, description: t.how_to_play_desc, response: t.how_to_play_response },
    { icon: Lightbulb, title: t.country_hints, description: t.country_hints_desc, response: t.country_hints_response },
    { icon: Award, title: t.progress_tips, description: t.progress_tips_desc, response: t.progress_tips_response },
  ];

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedTopic(null), 300);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-2xl shadow-2xl shadow-indigo-500/30 border border-white/20 font-medium text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <MessageCircle className="w-4 h-4" />
        </div>
        <span className="hidden sm:inline">{t.chat_title}</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={closeModal}>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950 to-purple-950 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0">🤖</div>
                  <div>
                    <div className="font-bold text-lg text-white">{t.chat_title}</div>
                    <div className="text-indigo-300 text-xs">{t.chat_subtitle}</div>
                  </div>
                </div>
                <button onClick={closeModal} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 p-5">
                {selectedTopic === null ? (
                  <div className="space-y-3">
                    <div className="text-slate-400 text-sm mb-4">{t.chat_topics_title}</div>
                    {helpTopics.map((topic, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedTopic(index)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex gap-3 items-start group transition-all text-left"
                      >
                        <div className="mt-0.5 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <topic.icon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm mb-0.5 group-hover:text-indigo-300">{topic.title}</div>
                          <div className="text-slate-400 text-xs leading-snug">{topic.description}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 mt-1 shrink-0" />
                      </motion.button>
                    ))}
                    <div className="pt-4 text-center">
                      <div className="inline-flex items-center gap-2 text-[10px] text-slate-500">{t.powered_by}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                      <div className="flex gap-3 mb-4">
                        <div className="text-3xl shrink-0 select-none">🤖</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-[10px] text-emerald-400 mb-1">GEO BOT • INSTANT REPLY</div>
                          <div className="text-white leading-relaxed text-sm whitespace-pre-line">{helpTopics[selectedTopic].response}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setSelectedTopic(null)} className="flex-1 py-3 text-sm font-medium border border-white/20 hover:bg-white/5 rounded-2xl transition-colors">{t.other_questions}</button>
                      <button onClick={closeModal} className="flex-1 py-3 bg-white text-slate-900 font-semibold rounded-2xl text-sm hover:bg-white/90 transition-all">{t.back_to_game}</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
