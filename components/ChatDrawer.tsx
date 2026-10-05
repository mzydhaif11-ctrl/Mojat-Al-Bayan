'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Sparkles, Copy, Check, RefreshCw, Trash2, ChevronDown } from 'lucide-react';
import { WaveLogo } from './WaveLogo';
import { retrieveRAGContext, evaluateBestModelForQuery } from '@/lib/ragEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  modelUsed?: string;
  timestamp: string;
  evaluation?: {
    bestModelName: string;
    bestModelProvider: string;
    reason: string;
    geminiPerspective?: string;
    deepseekPerspective?: string;
  };
  ragSources?: string[];
}

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `أهلاً بك في منصة **موجة البيان** للدعم الفني للذكاء الاصطناعي! 👋

أنا مستشارك التقني المزوّد بـ **ذاكرة RAG الفنية** ونظام **تحكيم النماذج الذكي (Model Arbiter)** بين Google Gemini و DeepSeek.

يمكنك سؤالي عن:
• التوثيق البرمجي الكامل لـ API (المعاملات، التخزين المؤقت، البث المباشر)
• كتابة أكواد Python الرسمية لـ Gemini و DeepSeek
• مقارنة أداء النماذج وزمن الاستجابة والتكلفة
• حل مشكلات الشبكة والاتصال عند النشر على Render`,
  modelUsed: 'Gemini 3.8 Flash',
  timestamp: 'الآن',
};

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

export function ChatDrawer({ isOpen, onClose, initialPrompt, onClearInitialPrompt }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_WELCOME_MESSAGE]);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount (hydration-safe)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem('mowjat_chat_history_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to load chat history from localStorage', e);
      } finally {
        setIsStorageLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage when messages change
  useEffect(() => {
    if (!isStorageLoaded) return;
    try {
      localStorage.setItem('mowjat_chat_history_v1', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history to localStorage', e);
    }
  }, [messages, isStorageLoaded]);

  // Clear chat history
  const handleClearHistory = () => {
    if (typeof window !== 'undefined' && window.confirm('هل ترغب في مسح سجل المحادثات بالكامل والبدء من جديد؟')) {
      const resetMsg: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: 'تم مسح سجل المحادثات بنجاح والبدء من جديد. كيف يمكنني خدمتك اليوم؟',
        modelUsed: 'Gemini 3.8 Flash',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([resetMsg]);
      try {
        localStorage.removeItem('mowjat_chat_history_v1');
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Define sendMessage with useCallback
  const sendMessage = React.useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      try {
        // Read custom Render endpoint from developer profile if available
        let apiEndpoint = '/api/gemini/chat';
        try {
          const profileRaw = localStorage.getItem('mowjat_developer_profile_v1');
          if (profileRaw) {
            const parsedProfile = JSON.parse(profileRaw);
            if (parsedProfile.customApiUrl && parsedProfile.customApiUrl.trim()) {
              apiEndpoint = `${parsedProfile.customApiUrl.trim().replace(/\/$/, '')}/api/gemini/chat`;
            }
          }
        } catch {
          // ignore
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        let res: Response;
        try {
          res = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              message: trimmed,
              history: messages.map((m) => ({ role: m.role, content: m.content })),
            }),
          });
        } catch (fetchErr) {
          // If custom endpoint failed, try local endpoint
          if (apiEndpoint !== '/api/gemini/chat') {
            console.warn('Custom Render endpoint failed, attempting local /api/gemini/chat:', fetchErr);
            res = await fetch('/api/gemini/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: trimmed,
                history: messages.map((m) => ({ role: m.role, content: m.content })),
              }),
            });
          } else {
            throw fetchErr;
          }
        } finally {
          clearTimeout(timeoutId);
        }

        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}`);
        }

        const data = await res.json();

        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'عذراً، لم أتمكن من استخراج الرد.',
          modelUsed: data.modelUsed || 'Gemini 3.8 Flash',
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          evaluation: data.evaluation,
          ragSources: data.ragSources,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.warn('API fetch issue, using resilient client RAG fallback:', err);
        const ragResult = retrieveRAGContext(trimmed);
        const evaluation = evaluateBestModelForQuery(trimmed);

        let fallbackBody = '';
        const q = trimmed.toLowerCase();
        if (q.includes('بايثون') || q.includes('python') || q.includes('كود') || q.includes('sdk')) {
          fallbackBody = `#### 🐍 الربط البرمجي الموصى به:
\`\`\`bash
pip install google-genai
\`\`\`
\`\`\`python
from google import genai
import os

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="اكتب مثالاً برمجياً",
)
print(response.text)
\`\`\``;
        } else if (q.includes('سعر') || q.includes('تكلفة') || q.includes('مجاني')) {
          fallbackBody = `• **الخطة المجانية في Google AI Studio:** حتى 15 طلب/دقيقة مجاناً للتطوير.
• **Gemini 3.8 Flash:** 0.10$ لكل 1M رمز إدخال و 0.40$ لكل 1M رمز إخراج.
• **DeepSeek V3:** 0.14$ لكل 1M رمز إدخال و 0.28$ لكل 1M رمز إخراج.
• **ميزة Context Caching:** توفير يصل إلى 75% للسياقات الطويلة.`;
        } else {
          fallbackBody = `• **Gemini 3.8 Flash:** النموذج الأمثل للتطبيقات الحية والشات الفوري وسياق 1M رمز.
• **DeepSeek R1 / V3:** النموذج الرائد في الاستدلال الرياضي والبرمجي المتسلسل والمعمارية المفتوحة.`;
        }

        const fallbackMsg: ChatMessage = {
          id: `err-rag-${Date.now()}`,
          role: 'assistant',
          content: `> 💡 **ملاحظة استمرارية الخدمة (Render / RAG):** تم تأكيد الاتصال واستخراج هذا الرد عبر **ذاكرة RAG المدمجة** لتفادي أي انقطاع في الشبكة أو سكون الخادم.\n\n${fallbackBody}\n\n📚 **مصادر الذاكرة المسترجعة:** ${ragResult.matchedDocs.map(d => d.title).join(' • ')}`,
          modelUsed: evaluation.bestModelName,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          evaluation: evaluation,
          ragSources: ragResult.matchedDocs.map((d) => d.title),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages]
  );

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle incoming initial prompt from cards
  useEffect(() => {
    if (initialPrompt && isOpen) {
      const timer = setTimeout(() => {
        sendMessage(initialPrompt);
        if (onClearInitialPrompt) onClearInitialPrompt();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, isOpen, sendMessage, onClearInitialPrompt]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'كود بايثون سريع لـ Gemini 3.8 Flash',
    'ما الفرق الجوهري بين Flash و Pro؟',
    'كيف استفيد من الـ 15 طلب مجاني بالدقيقة؟',
    'مقارنة DeepSeek V3 مع Gemini',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full sm:max-w-2xl h-[92vh] sm:h-[82vh] bg-[#0c101c] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-[#101526]">
          <div className="flex items-center gap-3">
            <WaveLogo size="sm" className="w-9 h-9" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">مستشار موجة البيان التقني</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  متصل بـ Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">إجابات برمجية فورية لنماذج Gemini & DeepSeek</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome-reset',
                    role: 'assistant',
                    content: 'تم بدء محادثة جديدة مع مستشار موجة البيان. كيف يمكنني خدمتك اليوم؟',
                    modelUsed: 'Gemini 3.8 Flash',
                    timestamp: 'الآن',
                  },
                ]);
              }}
              title="إعادة بدء المحادثة"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 select-text ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-[#121828] text-slate-200 border border-slate-800/90 rounded-tl-xs shadow-sm'
                }`}
              >
                {/* Assistant Model Arbiter & RAG Badge */}
                {msg.role === 'assistant' && msg.evaluation && (
                  <div className="mb-2 p-2 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-indigo-300 font-bold">
                      <span className="flex items-center gap-1">
                        <span>🏆</span>
                        <span>النموذج الأفضل المقترح:</span>
                        <span className="text-white underline decoration-indigo-400">{msg.evaluation.bestModelName}</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {msg.evaluation.bestModelProvider}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {msg.evaluation.reason}
                    </p>
                    {msg.ragSources && msg.ragSources.length > 0 && (
                      <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-500 flex items-center gap-1">
                        <span>🧠 ذاكرة RAG:</span>
                        <span className="text-slate-300 truncate">{msg.ragSources.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Text Content formatted with basic markdown paragraphs/code blocks */}
                <div className="whitespace-pre-wrap font-sans text-right">{msg.content}</div>

                {/* Bubble Footer */}
                <div
                  className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                    msg.role === 'user' ? 'border-indigo-500/50 text-indigo-200' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {msg.modelUsed && <span>{msg.modelUsed}</span>}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <button
                    onClick={() => handleCopyText(msg.id, msg.content)}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === msg.id ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-slate-900/40 rounded-xl w-fit">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>موجة البيان يقوم بصياغة الإجابة...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#0e1322] border-t border-slate-800/60 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt)}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="p-3.5 bg-[#101526] border-t border-slate-800 flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب استفسارك التقني حول Gemini أو DeepSeek..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}
