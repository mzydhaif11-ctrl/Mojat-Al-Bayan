'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Sparkles } from 'lucide-react';
import { STANDALONE_HTML_CODE } from '@/lib/standaloneHtml';

interface HtmlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HtmlExportModal({ isOpen, onClose }: HtmlExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(STANDALONE_HTML_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([STANDALONE_HTML_CODE], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mowjat-al-bayan.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-[#0c101c] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#101526]">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">كود HTML المستقل الكامل (Single-File HTML)</h2>
              <p className="text-xs text-slate-400">
                ملف HTML متكامل وخفيف يحتوي على كافة الأنماط والـ CSS والخطوط والبرمجة التفاعلية
              </p>
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-300">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              جاهز للتشغيل المباشر في أي متصفح بالنقر المزدوج (بدون خادم أو إعدادات)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <Download className="w-4 h-4" />
                <span>تحميل ملف HTML</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer font-bold shadow-sm shadow-indigo-600/30"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم نسخ الكود بالكامل!' : 'نسخ كود HTML'}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="rounded-2xl border border-slate-800 bg-[#060810] overflow-hidden text-left font-mono">
            <div className="px-4 py-2 bg-[#0e1322] border-b border-slate-800/80 text-xs text-slate-400 flex justify-between items-center">
              <span>mowjat-al-bayan.html (ملف مستقل)</span>
              <span className="text-[10px] text-slate-500">UTF-8 • HTML5 • CSS3 • Vanilla JS</span>
            </div>
            <pre className="p-4 text-xs text-slate-300 overflow-x-auto max-h-[50vh] leading-relaxed select-text" dir="ltr">
              <code>{STANDALONE_HTML_CODE}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800/80 bg-[#101526] flex justify-end items-center text-xs text-slate-400">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
