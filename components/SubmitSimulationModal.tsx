'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, RotateCcw, Copy, Check, Code, Play } from 'lucide-react';

export const STANDALONE_SUBMIT_CODE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>محاكاة زر الإرسال مع التحميل</title>
  <style>
    /* إعادة الضبط والخطوط */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    body {
      background: linear-gradient(135deg, #0b0f19 0%, #1e1b4b 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      color: #f8fafc;
    }

    /* بطاقة النموذج */
    .card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 36px 30px;
      width: 100%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
    }

    h2 {
      font-size: 22px;
      margin-bottom: 8px;
      color: #ffffff;
    }

    p.subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .form-group {
      margin-bottom: 20px;
      text-align: right;
    }

    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #cbd5e1;
      margin-bottom: 6px;
    }

    input {
      width: 100%;
      padding: 12px 14px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid #334155;
      border-radius: 12px;
      color: #f8fafc;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
    }

    /* زر الإرسال */
    .btn-submit {
      width: 100%;
      padding: 14px 20px;
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: white;
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.5);
      transition: all 0.25s ease;
    }

    .btn-submit:hover:not(:disabled) {
      background: linear-gradient(135deg, #4338ca, #4f46e5);
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -4px rgba(99, 102, 241, 0.6);
    }

    .btn-submit:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-submit:disabled {
      opacity: 0.8;
      cursor: not-allowed;
    }

    /* دائرة التحميل الدوارة (CSS Spinner) */
    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* رسالة النجاح */
    .success-box {
      display: none;
      margin-top: 20px;
      padding: 16px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 14px;
      color: #34d399;
      font-size: 14px;
      font-weight: 700;
      animation: fadeInScale 0.4s ease forwards;
    }

    .success-box.show {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.92);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* زر إعادة التجربة */
    .btn-reset {
      margin-top: 14px;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 12px;
      cursor: pointer;
      text-decoration: underline;
      display: none;
    }

    .btn-reset.show {
      display: inline-block;
    }

    .btn-reset:hover {
      color: #cbd5e1;
    }
  </style>
</head>
<body>

  <div class="card">
    <h2>نموذج إرسال تفاعلي</h2>
    <p class="subtitle">اضغط على زر "إرسال" لمحاكاة التحميل لمدة 3 ثوانٍ وظهور رسالة النجاح</p>

    <form id="submitForm" onsubmit="handleSubmit(event)">
      <div class="form-group">
        <label for="userName">الاسم أو البريد الإلكتروني</label>
        <input type="text" id="userName" placeholder="أدخل اسمك هنا..." value="مستخدم منصة البيان" required />
      </div>

      <button type="submit" id="submitBtn" class="btn-submit">
        <span id="btnText">إرسال</span>
        <div id="btnSpinner" class="spinner" style="display: none;"></div>
      </button>
    </form>

    <!-- رسالة النجاح -->
    <div id="successMessage" class="success-box">
      <span>✓</span>
      <span>تم الإرسال بنجاح</span>
    </div>

    <!-- زر إعادة التجربة -->
    <button type="button" id="resetBtn" class="btn-reset" onclick="resetForm()">إعادة التجربة من جديد</button>
  </div>

  <script>
    function handleSubmit(event) {
      event.preventDefault(); // منع إعادة تحميل الصفحة الافتراضية

      const btn = document.getElementById('submitBtn');
      const btnText = document.getElementById('btnText');
      const spinner = document.getElementById('btnSpinner');
      const successBox = document.getElementById('successMessage');
      const resetBtn = document.getElementById('resetBtn');

      // 1. تفعيل حالة التحميل
      btn.disabled = true;
      btnText.textContent = 'جاري التحميل...';
      spinner.style.display = 'block';
      successBox.classList.remove('show');
      resetBtn.classList.remove('show');

      // 2. محاكاة عملية التحميل لمدة 3 ثوانٍ (3000 ملي ثانية)
      setTimeout(function () {
        // إيقاف التحميل
        spinner.style.display = 'none';
        btnText.textContent = 'تم الإرسال';
        btn.style.background = '#059669'; // تحويل لون الزر إلى الأخضر

        // عرض رسالة "تم الإرسال بنجاح"
        successBox.classList.add('show');
        resetBtn.classList.add('show');
      }, 3000);
    }

    function resetForm() {
      const btn = document.getElementById('submitBtn');
      const btnText = document.getElementById('btnText');
      const spinner = document.getElementById('btnSpinner');
      const successBox = document.getElementById('successMessage');
      const resetBtn = document.getElementById('resetBtn');

      btn.disabled = false;
      btnText.textContent = 'إرسال';
      btn.style.background = '';
      spinner.style.display = 'none';
      successBox.classList.remove('show');
      resetBtn.classList.remove('show');
    }
  </script>
</body>
</html>`;

interface SubmitSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitSimulationModal({ isOpen, onClose }: SubmitSimulationModalProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'code'>('demo');
  const [name, setName] = useState('أحمد العتيبي');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [copied, setCopied] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(3);

  // Countdown timer for realistic feedback during the 3 seconds
  useEffect(() => {
    if (status !== 'loading') return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  if (!isOpen) return null;

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    setTimerSeconds(3);
    setStatus('loading');

    // Simulate 3 seconds exactly as requested
    setTimeout(() => {
      setStatus('success');
    }, 3000);
  };

  const handleReset = () => {
    setStatus('idle');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(STANDALONE_SUBMIT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#0c101d] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#101526]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Play className="w-4 h-4 fill-indigo-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                محاكاة زر الإرسال والتحميل (3 ثوانٍ)
              </h2>
              <p className="text-xs text-slate-400">
                واجهة HTML & CSS تفاعلية مع دائرة دوارة ورسالة نجاح مؤكدة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('demo')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'demo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                المعاينة الحية
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>عرض الكود</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'demo' ? (
            <div className="flex flex-col items-center justify-center py-6">
              {/* Card Container */}
              <div className="w-full max-w-sm bg-[#121828] border border-slate-800/90 rounded-2xl p-6 shadow-xl relative">
                <h3 className="text-lg font-bold text-white text-center mb-1">واجهة النموذج</h3>
                <p className="text-xs text-slate-400 text-center mb-5">
                  انقر على زر &quot;إرسال&quot; لرؤية الدائرة الدوارة لمدة 3 ثوانٍ
                </p>

                <form onSubmit={handleStartSubmit} className="space-y-4">
                  <div className="text-right space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">الاسم أو البريد</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={status === 'loading'}
                      className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md ${
                      status === 'loading'
                        ? 'bg-indigo-700/80 cursor-wait'
                        : status === 'success'
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400'
                    }`}
                  >
                    {status === 'loading' ? (
                      <>
                        {/* Circular Rotating Spinner Animation */}
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                        <span>جاري التحميل... ({timerSeconds}s)</span>
                      </>
                    ) : status === 'success' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم الإرسال</span>
                      </>
                    ) : (
                      <span>إرسال</span>
                    )}
                  </button>
                </form>

                {/* Success Message Banner */}
                {status === 'success' && (
                  <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تم الإرسال بنجاح</span>
                  </div>
                )}

                {/* Reset Option */}
                {status === 'success' && (
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-slate-400 hover:text-slate-200 underline flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>إعادة التجربة من جديد</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">كود HTML & CSS كامل مع JavaScript المدمج</span>
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم نسخ الكود!' : 'نسخ الكود'}</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#060810] overflow-hidden text-left font-mono">
                <pre className="p-4 text-xs text-slate-300 overflow-x-auto max-h-[55vh] leading-relaxed select-text" dir="ltr">
                  <code>{STANDALONE_SUBMIT_CODE}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800/80 bg-[#101526] flex justify-between items-center text-xs text-slate-400">
          <span>مدة التحميل: 3000 ملي ثانية (3 ثوانٍ) مع دوران CSS كلاسيكي</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
