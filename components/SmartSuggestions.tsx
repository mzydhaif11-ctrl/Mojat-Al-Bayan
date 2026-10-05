'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, Bot, HelpCircle } from 'lucide-react';

export type ModelProvider = 'gemini' | 'deepseek';

interface SmartSuggestionsProps {
  onSelectQuestion: (question: string) => void;
  selectedProvider?: ModelProvider;
  onProviderChange?: (provider: ModelProvider) => void;
}

const SUGGESTIONS: Record<ModelProvider, { title: string; subtitle: string; questions: { id: string; text: string; tag: string }[] }> = {
  gemini: {
    title: 'Google Gemini',
    subtitle: 'أسئلة حول النماذج الرسمية، الـ SDK، والسرعة',
    questions: [
      {
        id: 'g1',
        text: 'ما الفرق بين Gemini 3.8 Flash و Pro من حيث السرعة والتكلفة؟',
        tag: 'مقارنة',
      },
      {
        id: 'g2',
        text: 'كيف أربط Gemini بـ Python باستخدام حزمة google-genai الرسمية؟',
        tag: 'كود بايثون',
      },
      {
        id: 'g3',
        text: 'كيف أستفيد من الـ 15 طلب مجاني بالدقيقة وميزة Context Caching؟',
        tag: 'الأسعار',
      },
    ],
  },
  deepseek: {
    title: 'DeepSeek',
    subtitle: 'أسئلة حول بنية MoE، نماذج R1، والربط البرمجي',
    questions: [
      {
        id: 'd1',
        text: 'كيف أربط DeepSeek V3 عبر بايثون ومكتبة OpenAI المتوافقة؟',
        tag: 'كود API',
      },
      {
        id: 'd2',
        text: 'ما الفرق بين DeepSeek V3 و DeepSeek R1 في التفكير والاستدلال؟',
        tag: 'الاستدلال',
      },
      {
        id: 'd3',
        text: 'كيف توفر معمارية خليط الخبراء (MoE) تكلفة وسرعة عالية؟',
        tag: 'المعمارية',
      },
    ],
  },
};

export function SmartSuggestions({ onSelectQuestion, selectedProvider: propProvider, onProviderChange }: SmartSuggestionsProps) {
  const [internalProvider, setInternalProvider] = useState<ModelProvider>('gemini');
  const provider = propProvider || internalProvider;

  const handleProviderSelect = (p: ModelProvider) => {
    if (onProviderChange) {
      onProviderChange(p);
    } else {
      setInternalProvider(p);
    }
  };

  const currentData = SUGGESTIONS[provider];

  return (
    <div className="w-full space-y-2.5">
      {/* Header & Model Selector */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>اقتراحات الأسئلة الذكية</span>
        </div>

        {/* Gemini vs DeepSeek Tabs */}
        <div className="flex items-center p-0.5 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => handleProviderSelect('gemini')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              provider === 'gemini'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Gemini</span>
          </button>

          <button
            type="button"
            onClick={() => handleProviderSelect('deepseek')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              provider === 'deepseek'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>DeepSeek</span>
          </button>
        </div>
      </div>

      {/* 3 Smart Question Options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={provider}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-1.5"
        >
          {currentData.questions.map((item, index) => (
            <motion.div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectQuestion(item.text)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectQuestion(item.text);
                }
              }}
              whileHover={{ scale: 1.01, x: -2 }}
              whileTap={{ scale: 0.99 }}
              className="group flex items-center justify-between p-2.5 px-3 rounded-xl bg-[#0f1424]/90 hover:bg-[#161e36] border border-slate-800/80 hover:border-indigo-500/40 text-right cursor-pointer transition-all shadow-sm select-none"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="w-5 h-5 rounded-lg bg-slate-800/80 group-hover:bg-indigo-600/30 text-slate-400 group-hover:text-indigo-300 flex items-center justify-center shrink-0 text-[10px] font-mono transition-colors">
                  {index + 1}
                </span>
                <span className="text-xs text-slate-300 group-hover:text-white truncate font-medium">
                  {item.text}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 mr-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 group-hover:text-indigo-300 font-mono">
                  {item.tag}
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
