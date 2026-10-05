'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Play, Terminal, Code2, Sparkles } from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  desc: string;
  code: string;
  simulatedOutput: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: 'quickstart',
    title: '1. التثبيت والاتصال الأساسي',
    desc: 'تثبيت مكتبة google-genai الحديثة والاتصال بنموذج Gemini 3.8 Flash',
    code: `# تثبيت الحزمة الرسمية في الطرفية أولاً:
# pip install google-genai

import os
from google import genai

# تهيئة العميل (يقرأ تلقائياً GEMINI_API_KEY من البيئة)
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# استدعاء النموذج لتوليد إجابة
response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="ما هي أفضل ممارسة لمعالجة النصوص الطويلة في الذكاء الاصطناعي؟",
)

print("رد النموذج:")
print(response.text)`,
    simulatedOutput: `رد النموذج:
أفضل الممارسات لمعالجة النصوص الطويلة:
1. الاستفادة من نافذة السياق الضخمة (1M - 2M tokens) في Gemini 3.8 Flash.
2. تفعيل تقنية التخزين المؤقت للسياق (Context Caching) لخفض التكلفة بنسبة 75%.
3. تنظيم المدخلات عبر علامات واضحة (Markdown Headers) لتوجيه انتباه النموذج بدقة.`,
  },
  {
    id: 'streaming',
    title: '2. البث المباشر للردود (Streaming)',
    desc: 'تلقي الكلمات كلمة بكلمة في الوقت الفعلي لتجربة مستخدم تفاعلية فائقة السرعة',
    code: `import os
from google import genai

client = genai.Client()

print("جاري استقبال البث المباشر: ", end="")

# استخدام دالة generate_content_stream
response_stream = client.models.generate_content_stream(
    model="gemini-3.8-flash",
    contents="اكتب دالة بايثون لحساب الأعداد الأولية مع الشرح الموجز",
)

for chunk in response_stream:
    # طباعة كل جزء يصل فوراً بدون انتظار اكتمال الرد
    print(chunk.text, end="", flush=True)
print("\\n-- تم الانتهاء بنجاح --")`,
    simulatedOutput: `جاري استقبال البث المباشر: 
def is_prime(n: int) -> bool:
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0: return False
    return True

# الشرح: تفحص الدالة قابلية القسمة حتى الجذر التربيعي للعدد لتقليل التعقيد الحسابي.
-- تم الانتهاء بنجاح --`,
  },
  {
    id: 'system_instruction',
    title: '3. تعليمات النظام (System Instruction)',
    desc: 'تحديد شخصية النموذج، دوره، القيود، ولغة الإخراج المطلوبة',
    code: `from google import genai
from google.genai import types

client = genai.Client()

# إعداد تعليمات النظام المخصصة
config = types.GenerateContentConfig(
    system_instruction="أنت مهندس دعم فني أول في منصة موجة البيان. أجب دائماً بالعربية الفصحى مع دعم إجاباتك بنقاط برمجية محددة.",
    temperature=0.3, # درجة إبداع منخفضة لدقة تقنية أعلى
)

response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="كيف أختار بين نموذج Flash ونموذج Pro لمشروعي القادم؟",
    config=config
)

print(response.text)`,
    simulatedOutput: `منصة موجة البيان - الدعم الفني:
لاختيار النموذج المناسب لمشروعك، اتبع المعايير التالية:
1. اختر Gemini 3.8 Flash إذا كان تطبيقك يتطلب سرعة استجابة فورية (شات بوت) وتكلفة منخفضة جداً.
2. اختر Gemini 3.1 Pro إذا كانت مهامك تتضمن استدلالاً كودياً معقداً أو رياضيات متقدمة أو تحليل ملفات أكاديمية هائلة.`,
  },
  {
    id: 'deepseek_comparison',
    title: '4. الاتصال بنموذج DeepSeek API',
    desc: 'استدعاء DeepSeek V3 عبر مكتبة OpenAI القياسية المتوافقة',
    code: `import os
from openai import OpenAI

# يتوافق DeepSeek مع مكتبة OpenAI الرسمية
client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-chat", # DeepSeek V3
    messages=[
        {"role": "system", "content": "أنت خبير ذكاء اصطناعي في منصة موجة البيان."},
        {"role": "user", "content": "ما هي مزايا بنية MoE (خليط الخبراء)؟"}
    ],
    stream=False
)

print(response.choices[0].message.content)`,
    simulatedOutput: `مزايا معمارية خليط الخبراء (Mixture of Experts - MoE) في DeepSeek V3:
1. تفعيل جزء فقط من المعلمات الحسابية (37 مليار من أصل 671 مليار) لكل رمز، مما يوفر سرعة هائلة.
2. خفض التكلفة الحسابية والاستهلاك الطاقي لمراكز البيانات بنسبة تتجاوز 60%.
3. جودة مخرجات تضاهي أكبر النماذج المغلقة مثل GPT-4o.`,
  },
];

interface PythonPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAi: (topic: string) => void;
}

export function PythonPlaygroundModal({ isOpen, onClose, onAskAi }: PythonPlaygroundModalProps) {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(SNIPPETS[0]);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTerminalOutput('جارِ تشغيل السكربت والاتصال بـ API...');
    setTimeout(() => {
      setTerminalOutput(selectedSnippet.simulatedOutput);
      setIsRunning(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-[#0c101c] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#101626]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🐍</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">البدء مع Python و SDK الرسمي</h2>
              <p className="text-xs text-slate-400">أمثلة برمجية حقيقية لربط Google Gemini و DeepSeek</p>
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
          {/* Snippet selector tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SNIPPETS.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => {
                  setSelectedSnippet(snippet);
                  setTerminalOutput(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSnippet.id === snippet.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {snippet.title}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-300 px-1 font-medium">{selectedSnippet.desc}</p>

          {/* Code Window with editor styling */}
          <div className="rounded-2xl border border-slate-800 bg-[#070a12] overflow-hidden shadow-inner text-left font-mono">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1422] border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-xs text-slate-400 ml-2 font-mono">mowjat_bayan.py</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="px-3 py-1 text-xs font-sans font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>{isRunning ? 'جاري التشغيل...' : 'تجربة الكود'}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-xs font-sans font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <pre className="p-4 text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed select-text" dir="ltr">
              <code>{selectedSnippet.code}</code>
            </pre>
          </div>

          {/* Terminal Output if run */}
          {terminalOutput && (
            <div className="rounded-2xl border border-slate-800 bg-[#050811] p-4 text-left font-mono text-xs shadow-inner animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-800/60 mb-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px]">مخرجات الطرفية المحاكية (Terminal Output):</span>
              </div>
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed select-text" dir="rtl">
                {terminalOutput}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800/80 bg-[#101626] flex justify-between items-center text-xs text-slate-400">
          <button
            onClick={() => onAskAi('كيف أربط كود بايثون مع Gemini 3.8 Flash؟')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>طلب مساعدة تقنية إضافية من المساعد</span>
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
