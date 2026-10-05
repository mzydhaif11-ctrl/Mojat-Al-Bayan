'use client';

import React, { useState } from 'react';
import { X, Check, Zap, Sparkles, Layers, Cpu } from 'lucide-react';

interface ModelInfo {
  id: string;
  name: string;
  provider: 'Google Gemini' | 'DeepSeek';
  tag: string;
  contextWindow: string;
  speed: string;
  speedScore: number; // 1-10
  intelligenceScore: number; // 1-10
  costScore: string;
  idealFor: string;
  description: string;
}

const MODELS: ModelInfo[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'Google Gemini',
    tag: 'السرعة والذكاء المتوازن',
    contextWindow: '1,000,000 رمز',
    speed: 'فائق السرعة (~0.4 ثانية)',
    speedScore: 9.8,
    intelligenceScore: 9.2,
    costScore: '$0.10 / 1M رمز إدخال',
    idealFor: 'تطبيقات الويب والشات الحي، التلخيص، تحليل المستندات الطويلة، وتطبيقات الإنتاج',
    description: 'الجيل الأحدث من عائلة Flash، يجمع بين زمن الاستجابة الفوري وأداء استدلالي يضاهي نماذج Pro السابقة مع نافذة سياق مليونية.',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    provider: 'Google Gemini',
    tag: 'الاستدلال البرمجي والعميق',
    contextWindow: '2,000,000 رمز',
    speed: 'متوسط السرعة (~1.8 ثانية)',
    speedScore: 7.5,
    intelligenceScore: 9.9,
    costScore: '$1.25 / 1M رمز إدخال',
    idealFor: 'هندسة البرمجيات المعقدة، حل المسائل الرياضية، التحليل القانوني والأكاديمي المعقد',
    description: 'النموذج الرائد لأصعب التحديات المنطقية والبرمجية، يدعم سياقاً هائلاً يصل إلى مليوني رمز لمعالجة كتب كاملة أو مستودعات كود.',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    provider: 'Google Gemini',
    tag: 'أعلى كفاءة وأقل تكلفة',
    contextWindow: '1,000,000 رمز',
    speed: 'خارق السرعة (~0.25 ثانية)',
    speedScore: 10,
    intelligenceScore: 8.4,
    costScore: '$0.075 / 1M رمز إدخال',
    idealFor: 'تصنيف البيانات، الفرز الآلي، روبوتات المحادثة البسيطة ذات الحجم الضخم من الزيارات',
    description: 'مصمم خصيصاً للعمليات ذات الحجم المرتفع جداً وحيث يكون زمن الاستجابة والتكلفة المنخفضة هما الأولوية القصوى.',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    tag: 'معمارية MoE المفتوحة',
    contextWindow: '128,000 رمز',
    speed: 'سريع (~0.8 ثانية)',
    speedScore: 8.5,
    intelligenceScore: 9.3,
    costScore: '$0.14 / 1M رمز إدخال',
    idealFor: 'المهام العامة المتقدمة، الاستضافة الذاتية، وحلول المصادر المفتوحة',
    description: 'نموذج مفتوح الأوزان بمعمارية خليط الخبراء (MoE) بحجم 671 مليار معلمة، يتميز بكفاءة حسابية وتكلفة استهلاك منخفضة.',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    tag: 'التفكير والاستدلال المنطقي',
    contextWindow: '128,000 رمز',
    speed: 'تفكير متأني (~3-6 ثوانٍ)',
    speedScore: 6.0,
    intelligenceScore: 9.8,
    costScore: '$0.55 / 1M رمز إدخال',
    idealFor: 'التفكير المتسلسل (Chain of Thought)، الرياضيات، وإثبات البراهين',
    description: 'نموذج استدلال متقدم تم تدريبه بالتعلم المعزز النقي (RL) لإظهار مسار التفكير المنطقي والتدقيق الذاتي قبل إعطاء الإجابة النهائية.',
  },
];

interface ModelComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAi: (modelName: string) => void;
}

export function ModelComparatorModal({ isOpen, onClose, onAskAi }: ModelComparatorModalProps) {
  const [selectedModel, setSelectedModel] = useState<ModelInfo>(MODELS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0d121f] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#111728]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">النماذج المتوفرة وأحدث الإصدارات</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Model pills selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedModel.id === model.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                <span>{model.name}</span>
                {selectedModel.id === model.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          {/* Active Model Spotlight */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#131b2e] to-[#0f1524] border border-slate-800 space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {selectedModel.provider}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{selectedModel.name}</h3>
                <p className="text-xs text-indigo-300 font-medium">{selectedModel.tag}</p>
              </div>

              <button
                onClick={() => onAskAi(selectedModel.name)}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>استشر الذكاء الاصطناعي</span>
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{selectedModel.description}</p>

            {/* Performance Metrics Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>السرعة وزمن الاستجابة</span>
                  <span className="font-mono text-emerald-400">{selectedModel.speedScore}/10</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedModel.speedScore * 10}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{selectedModel.speed}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>قوة الاستدلال والبرمجة</span>
                  <span className="font-mono text-indigo-400">{selectedModel.intelligenceScore}/10</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedModel.intelligenceScore * 10}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">{selectedModel.costScore}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>نافذة السياق</span>
                </div>
                <div className="font-bold text-slate-200">{selectedModel.contextWindow}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>الاستخدام الأمثل</span>
                </div>
                <div className="font-medium text-slate-200 text-[11px] leading-tight line-clamp-2">
                  {selectedModel.idealFor}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800/80 bg-[#111728] flex justify-between items-center text-xs text-slate-400">
          <span>منصة موجة البيان للدعم الفني للذكاء الاصطناعي</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
