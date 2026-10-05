'use client';

import React from 'react';
import { X, Zap, Cpu, Sparkles, DollarSign, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAi: (topic: string) => void;
}

export function ComparisonModal({ isOpen, onClose, onAskAi }: ComparisonModalProps) {
  if (!isOpen) return null;

  const comparisonRows = [
    {
      feature: 'السرعة وزمن الاستجابة',
      flash: 'فائق السرعة (0.3 - 0.6 ثانية)',
      pro: 'استجابة متأنية (1.5 - 3.0 ثانية)',
      winner: 'flash',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
    },
    {
      feature: 'التكلفة لكل 1M رمز إدخال',
      flash: '$0.10 (أوفر بنسبة 92%)',
      pro: '$1.25 - $2.50',
      winner: 'flash',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
    },
    {
      feature: 'الاستدلال المنطقي المعقد وكتابة الأكواد',
      flash: 'ممتاز للمهام المباشرة والمتوسطة',
      pro: 'أداء فائق واستثنائي (Leaderboard SOTA)',
      winner: 'pro',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
    },
    {
      feature: 'نافذة السياق القصوى',
      flash: '1,000,000 رمز',
      pro: '2,000,000 رمز (ضعف السعة)',
      winner: 'pro',
      icon: <ShieldCheck className="w-4 h-4 text-blue-400" />,
    },
    {
      feature: 'الوسائط المتعددة (صور، صوت، فيديو)',
      flash: 'مدعومة بالكامل وبسرعة عالية',
      pro: 'مدعومة بأعلى دقة تحليل وتفصيل',
      winner: 'tie',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#0c101d] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#101526]">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">مقارنة شاملة: Flash مقابل Pro</h2>
              <p className="text-xs text-slate-400">دليلك الهندسي لاختيار النموذج الأنسب لمشروعك</p>
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
          {/* Visual Cards Summary */}
          <div className="grid grid-cols-2 gap-3">
            {/* Flash Column */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#182133] to-[#121927] border border-amber-500/30 text-center space-y-2">
              <div className="inline-flex p-2 rounded-xl bg-amber-500/10 text-amber-400 mb-1">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Gemini 3.8 Flash</h3>
              <p className="text-[11px] text-amber-300 font-medium">صاروخ السرعة والاقتصاد</p>
              <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-700/60 leading-relaxed">
                مثالي لـ 85% من التطبيقات، مثل روبوتات الدردشة، تصنيف المستندات، وواجهات الويب التفاعلية.
              </div>
            </div>

            {/* Pro Column */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1c1833] to-[#141227] border border-indigo-500/30 text-center space-y-2">
              <div className="inline-flex p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mb-1">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Gemini 3.1 Pro</h3>
              <p className="text-[11px] text-indigo-300 font-medium">عملاق التفكير والاستدلال</p>
              <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-700/60 leading-relaxed">
                مثالي للمهام البرمجية الشاقة، التحليل المالي المعقد، وتوليد الحلول المنطقية الصعبة.
              </div>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121f] overflow-hidden">
            <div className="px-4 py-3 bg-[#111728] border-b border-slate-800 font-bold text-xs text-slate-200">
              المقارنة التقنية المباشرة
            </div>

            <div className="divide-y divide-slate-800/80">
              {comparisonRows.map((row, idx) => (
                <div key={idx} className="p-3.5 hover:bg-slate-900/40 transition-colors space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    {row.icon}
                    <span>{row.feature}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div
                      className={`p-2 rounded-xl ${
                        row.winner === 'flash'
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-200 font-semibold'
                          : 'bg-slate-900/40 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block mb-0.5">Flash:</span>
                      {row.flash}
                    </div>

                    <div
                      className={`p-2 rounded-xl ${
                        row.winner === 'pro'
                          ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 font-semibold'
                          : 'bg-slate-900/40 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block mb-0.5">Pro:</span>
                      {row.pro}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best practice strategy box */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/40 text-xs text-indigo-200 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-indigo-300">
              <Sparkles className="w-4 h-4" />
              <span>استراتيجية التوجيه الذكي (Model Routing):</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              تنصح منصة <strong>موجة البيان</strong> باستخدام معمارية التوجيه الذكي: استقبال طلبات المستخدمين أولاً عبر{' '}
              <strong>Flash</strong> للتصنيف والتنفيذ السريع، وتمرير الطلبات المعقدة فقط التي تحتاج تفكيراً رياضياً أو كودياً إلى{' '}
              <strong>Pro</strong>، مما يوفر حتى 80% من ميزانية السحابة مع الحفاظ على أعلى جودة.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800/80 bg-[#101526] flex justify-between items-center text-xs text-slate-400">
          <button
            onClick={() => onAskAi('قارن بين أداء Gemini 3.8 Flash و Pro في كود بايثون')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>طلب مقارنة برمجية مفصلة</span>
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
