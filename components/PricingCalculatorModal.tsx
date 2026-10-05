'use client';

import React, { useState } from 'react';
import { X, DollarSign, Calculator, Zap, ShieldCheck, Sparkles } from 'lucide-react';

interface PricingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAi: (topic: string) => void;
}

export function PricingCalculatorModal({ isOpen, onClose, onAskAi }: PricingCalculatorModalProps) {
  // Tokens in Millions
  const [tokensInMillions, setTokensInMillions] = useState<number>(2);
  const [enableCaching, setEnableCaching] = useState<boolean>(true);

  if (!isOpen) return null;

  // Assuming 70% input tokens, 30% output tokens ratio
  const inputMillions = tokensInMillions * 0.7;
  const outputMillions = tokensInMillions * 0.3;

  // Pricing constants (USD per 1M tokens)
  const flashInputRate = 0.10;
  const flashOutputRate = 0.40;

  const proInputRate = 1.25;
  const proOutputRate = 5.00;

  const deepseekInputRate = 0.14;
  const deepseekOutputRate = 0.28;

  // Calculate costs with caching discount
  const cachingFactor = enableCaching ? 0.4 : 1.0; // 60% savings on input tokens
  const flashCost = (inputMillions * flashInputRate * cachingFactor + outputMillions * flashOutputRate).toFixed(3);
  const proCost = (inputMillions * proInputRate * cachingFactor + outputMillions * proOutputRate).toFixed(2);
  const deepseekCost = (inputMillions * deepseekInputRate + outputMillions * deepseekOutputRate).toFixed(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#0c101d] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#101526]">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">الحدود والأسعار وحاسبة التكلفة</h2>
              <p className="text-xs text-slate-400">حساب فوري لتكلفة الرموز والحدود المجانية والمدفوعة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Free Tier Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-emerald-300">الخطة المجانية في Google AI Studio (Free Tier)</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                $0.00 مجاناً
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تتيح لك Google تطوير واختبار تطبيقاتك بالكامل مجاناً بدون الحاجة لبطاقة ائتمانية بالحدود التالية:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">الطلبات / دقيقة</div>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">15 RPM</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">الرموز / دقيقة</div>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">1M TPM</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">الطلبات / يوم</div>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">1,500 RPD</div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="p-5 rounded-2xl bg-[#0f1424] border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">حاسبة التكلفة التقديرية للاستخدام التجاري</h4>
              </div>
              <span className="text-xs text-indigo-300 font-mono font-bold">{tokensInMillions}M رمز شهرياً</span>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>100 ألف رمز</span>
                <span>5 ملايين</span>
                <span>20 مليون رمز</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="20"
                step="0.2"
                value={tokensInMillions}
                onChange={(e) => setTokensInMillions(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Caching checkbox toggle */}
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableCaching}
                onChange={(e) => setEnableCaching(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-900"
              />
              <span>تفعيل خاصية التخزين المؤقت للسياق (Context Caching - خصم حتى 75% من تكلفة المدخلات المتكررة)</span>
            </label>

            {/* Real-time cost results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Flash Result */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                <span className="text-xs text-amber-300 font-bold block mb-1">Gemini 3.8 Flash</span>
                <div className="text-xl font-bold font-mono text-white">${flashCost}</div>
                <span className="text-[10px] text-slate-400 mt-1 block">شهرياً (الأوفر تكلفة)</span>
              </div>

              {/* DeepSeek Result */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center">
                <span className="text-xs text-blue-300 font-bold block mb-1">DeepSeek V3</span>
                <div className="text-xl font-bold font-mono text-white">${deepseekCost}</div>
                <span className="text-[10px] text-slate-400 mt-1 block">شهرياً (منافس قوي)</span>
              </div>

              {/* Pro Result */}
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center">
                <span className="text-xs text-purple-300 font-bold block mb-1">Gemini 3.1 Pro</span>
                <div className="text-xl font-bold font-mono text-white">${proCost}</div>
                <span className="text-[10px] text-slate-400 mt-1 block">شهرياً (أعلى دقة استدلال)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800/80 bg-[#101526] flex justify-between items-center text-xs text-slate-400">
          <button
            onClick={() => onAskAi('كيف أحسب تكلفة استدعاءات API في مشروعي بدقة؟')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>طلب نصائح تحسين التكاليف</span>
          </button>
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
