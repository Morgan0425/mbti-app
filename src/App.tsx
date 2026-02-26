/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, RefreshCw, MessageSquare, Info } from 'lucide-react';
import { getMBTIReactions } from './services/gemini';
import { MBTIResponse } from './types';
import { PERSONALITIES } from './constants';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState<MBTIResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getMBTIReactions(input);
      setReactions(data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError('哎呀，人格们集体罢工了...请稍后再试。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPersonalityData = (type: string) => {
    return PERSONALITIES.find(p => p.type === type);
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] selection:bg-blue-100 selection:text-blue-900 font-sans pb-20">
      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-blue-200"
        >
          <Sparkles className="w-3 h-3" />
          MBTI 16人格实验室
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-display font-black mb-6 tracking-tight text-slate-900">
          当 <span className="text-blue-600 relative">
            16人格
            <svg className="absolute -bottom-2 left-0 w-full h-2 text-blue-200" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span> 面对...
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          输入任何情境或难题，让16种性格的“专家”为你提供多维度的趣味解读与犀利吐槽。
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="pl-6 text-blue-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入一个事件，例如：突然中了一千万大奖..."
                className="w-full p-6 text-lg focus:outline-none placeholder:text-slate-300 font-medium"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="mr-2 px-8 py-4 blue-button rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>分析</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 mt-8" ref={resultsRef}>
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 text-center mb-12 flex items-center justify-center gap-2"
            >
              <Info className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          {reactions.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {reactions.map((res, idx) => {
                const pData = getPersonalityData(res.type);
                return (
                  <motion.div
                    key={res.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="glass-card rounded-3xl p-6 flex flex-col h-full relative group/card"
                  >
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pData?.color} opacity-80`}>
                        {pData?.category}
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center mb-8 pt-4">
                      <h3 className={`text-3xl font-black leading-tight mb-2 ${pData?.color?.split(' ').find(c => c.startsWith('text-')) || 'text-blue-600'}`}>
                        {res.type}
                      </h3>
                      <p className="text-lg font-bold text-slate-700 uppercase tracking-[0.2em]">{res.name}</p>
                    </div>

                    <div className="space-y-5 flex-grow">
                      <div className="relative">
                        <div className="absolute -left-2 top-0 text-3xl text-blue-100 font-serif">“</div>
                        <p className="text-base font-bold text-slate-700 leading-snug pl-4 pr-2 relative z-10">
                          {res.reaction}
                        </p>
                        <div className="absolute -right-1 bottom-0 text-3xl text-blue-100 font-serif">”</div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-500 leading-relaxed">
                          {res.view}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-gray-400"
              >
                <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-xl font-medium">等待你的离谱输入...</p>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="p-6 brutalist-card bg-white animate-pulse h-48">
                <div className="w-12 h-6 bg-gray-200 rounded mb-4" />
                <div className="w-24 h-6 bg-gray-200 rounded mb-4" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-100 rounded" />
                  <div className="w-full h-4 bg-gray-100 rounded" />
                  <div className="w-2/3 h-4 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="max-w-4xl mx-auto px-6 mt-20 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Info className="w-4 h-4" />
          <span>基于 AI 生成，仅供娱乐。不要太当真哦！</span>
        </div>
        <p>© 2026 MBTI 16人格大乱斗 · Powered by Gemini</p>
      </footer>
    </div>
  );
}
