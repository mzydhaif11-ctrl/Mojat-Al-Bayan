'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WaveLogo } from '@/components/WaveLogo';
import { StatusBar } from '@/components/StatusBar';
import { ActionCards, CardAction } from '@/components/ActionCards';
import { ModelComparatorModal } from '@/components/ModelComparatorModal';
import { PythonPlaygroundModal } from '@/components/PythonPlaygroundModal';
import { ComparisonModal } from '@/components/ComparisonModal';
import { PricingCalculatorModal } from '@/components/PricingCalculatorModal';
import { ChatDrawer } from '@/components/ChatDrawer';
import { HtmlExportModal } from '@/components/HtmlExportModal';
import { SubmitSimulationModal } from '@/components/SubmitSimulationModal';
import { SmartSuggestions, ModelProvider } from '@/components/SmartSuggestions';
import {
  Send,
  Sparkles,
  Smartphone,
  Monitor,
  FileCode,
  MessageSquare,
  Bot,
  Play,
} from 'lucide-react';

export default function HomePage() {
  // View mode: 'mobile' (matches the exact phone screen in the screenshot) or 'desktop' (wide responsive layout)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  // Active Modals
  const [activeModal, setActiveModal] = useState<CardAction['id'] | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Chat query state
  const [chatPrompt, setChatPrompt] = useState<string | null>(null);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>('gemini');

  const handleCardClick = (id: CardAction['id']) => {
    setActiveModal(id);
  };

  const handleAskAiFromModal = (promptText: string) => {
    setActiveModal(null);
    setChatPrompt(promptText);
    setIsChatOpen(true);
  };

  const handleSelectSmartQuestion = (question: string) => {
    setChatPrompt(question);
    setInputQuery(question);
    setIsChatOpen(true);
  };

  const handleBottomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    setChatPrompt(inputQuery.trim());
    setInputQuery('');
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient lighting effects */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[15%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Application Navigation Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between px-4 py-3 mb-4 rounded-2xl bg-[#0c101c]/80 backdrop-blur-md border border-slate-800/80 shadow-lg z-30">
        <div className="flex items-center gap-3">
          <WaveLogo size="sm" className="w-8 h-8" />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>منصة موجة البيان</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 3.8 Flash
              </span>
            </h1>
          </div>
        </div>

        {/* View Mode & Code Actions */}
        <div className="flex items-center gap-2">
          {/* Submit Loader Simulation Button */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-300" />
            <span className="hidden sm:inline">تجربة زر الإرسال (3s)</span>
            <span className="sm:hidden">زر الإرسال</span>
          </button>

          {/* Standalone HTML Button */}
          <button
            onClick={() => setIsHtmlModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">كود HTML المستقل</span>
            <span className="sm:hidden">كود HTML</span>
          </button>

          {/* Toggle View Mode */}
          <div className="hidden sm:flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('mobile')}
              title="عرض محاكي هاتف (مثل لقطة الشاشة)"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              title="عرض ويب كامل واسع"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main
        suppressHydrationWarning
        className={`w-full transition-all duration-300 relative z-10 flex flex-col justify-between ${
          viewMode === 'mobile'
            ? 'max-w-[412px] bg-[#090d16] border border-slate-800/80 rounded-[44px] shadow-2xl shadow-black/80 overflow-hidden min-h-[790px]'
            : 'max-w-3xl bg-[#090d16]/90 border border-slate-800/80 rounded-3xl shadow-xl p-4 sm:p-8 min-h-[740px]'
        }`}
      >
        {/* Mobile Status Bar (Visible in Mobile View) */}
        {viewMode === 'mobile' && <StatusBar />}

        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6">
          {/* Hero Section */}
          <section className="flex flex-col items-center text-center mt-2 sm:mt-6 mb-6">
            {/* The Great Wave Kanagawa Icon with Glow */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-5 cursor-pointer"
              onClick={() => setIsChatOpen(true)}
              title="انقر للتحدث مع مستشار موجة البيان"
            >
              <WaveLogo size="md" />
            </motion.div>

            {/* Glowing Gradient Title matching IMG_5396.png */}
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-2xl sm:text-3xl font-black tracking-tight mb-3"
            >
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                منصة موجة البيان
              </span>
            </motion.h2>

            {/* Subtitle matching exact Arabic text in IMG_5396.png */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-[340px] sm:max-w-md"
            >
              منصتك المتخصصة في الدعم الفني لنماذج الذكاء الاصطناعي من{' '}
              <span className="text-slate-300 font-semibold">Google Gemini</span> و{' '}
              <span className="text-slate-300 font-semibold">DeepSeek</span>. اختر سؤالاً مقترحاً أو ابدأ محادثتك مباشرة.
            </motion.p>
          </section>

          {/* 4 Interactive Cards Grid */}
          <motion.section
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="w-full my-auto"
          >
            <ActionCards onSelectCard={handleCardClick} activeId={activeModal} />
          </motion.section>

          {/* Smart Suggestions & Live Prompt Input Bar */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="w-full max-w-md mx-auto mt-5 space-y-3"
          >
            {/* Smart Question Suggestions */}
            <SmartSuggestions
              selectedProvider={selectedProvider}
              onProviderChange={setSelectedProvider}
              onSelectQuestion={handleSelectSmartQuestion}
            />

            <form
              onSubmit={handleBottomSubmit}
              className="flex items-center gap-2 p-1.5 pl-2 bg-[#101524] border border-slate-800 focus-within:border-indigo-500/70 rounded-2xl shadow-inner transition-colors"
            >
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>

              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="اكتب استفسارك هنا حول Gemini أو DeepSeek..."
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none text-right px-2"
              />

              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                title="فتح المحادثة الكاملة"
                className="p-2 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer matching exact screenshot copy */}
        <footer className="w-full py-4 text-center border-t border-slate-800/60 text-[11px] text-slate-500 select-none">
          2026 © موجة البيان • Powered by Gemini 3.8 Flash
        </footer>
      </main>

      {/* Floating Bottom Quick Help Button */}
      <div className="fixed bottom-4 left-4 z-30">
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105"
        >
          <MessageSquare className="w-4 h-4" />
          <span>المستشار الذكي المباشر</span>
        </button>
      </div>

      {/* Interactive Modals */}
      <AnimatePresence>
        {activeModal === 'models' && (
          <ModelComparatorModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onAskAi={handleAskAiFromModal}
          />
        )}

        {activeModal === 'python' && (
          <PythonPlaygroundModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onAskAi={handleAskAiFromModal}
          />
        )}

        {activeModal === 'comparison' && (
          <ComparisonModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onAskAi={handleAskAiFromModal}
          />
        )}

        {activeModal === 'pricing' && (
          <PricingCalculatorModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onAskAi={handleAskAiFromModal}
          />
        )}

        {isChatOpen && (
          <ChatDrawer
            isOpen={true}
            onClose={() => setIsChatOpen(false)}
            initialPrompt={chatPrompt}
            onClearInitialPrompt={() => setChatPrompt(null)}
          />
        )}

        {isHtmlModalOpen && (
          <HtmlExportModal
            isOpen={true}
            onClose={() => setIsHtmlModalOpen(false)}
          />
        )}

        {isSubmitModalOpen && (
          <SubmitSimulationModal
            isOpen={true}
            onClose={() => setIsSubmitModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
