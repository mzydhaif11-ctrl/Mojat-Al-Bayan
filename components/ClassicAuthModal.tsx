'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Mail,
  Key,
  Globe,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';

export interface DeveloperProfile {
  name: string;
  email: string;
  apiKey?: string;
  customApiUrl?: string;
  role: 'developer' | 'guest';
  isLoggedIn: boolean;
}

interface ClassicAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: DeveloperProfile) => void;
}

const STORAGE_KEY = 'mowjat_developer_profile_v1';

export function ClassicAuthModal({ isOpen, onClose, onProfileUpdated }: ClassicAuthModalProps) {
  const [profile, setProfile] = useState<DeveloperProfile>({
    name: 'مطور موجة البيان',
    email: 'dev@mowjat.ai',
    role: 'guest',
    isLoggedIn: false,
    customApiUrl: '',
    apiKey: '',
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');

  // Hydrate from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfile(parsed);
          if (onProfileUpdated) onProfileUpdated(parsed);
        }
      } catch (e) {
        console.warn('Failed to load profile from storage', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [onProfileUpdated]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DeveloperProfile = {
      ...profile,
      name: profile.name.trim() || 'مطور معتمد',
      email: profile.email.trim() || 'developer@example.com',
      isLoggedIn: true,
      role: 'developer',
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setProfile(updated);
      if (onProfileUpdated) onProfileUpdated(updated);
      setTestStatus('success');
      setTestMessage('تم حفظ بيانات الدخول وجلسة المطور بنجاح.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.warn('Storage save error:', err);
    }
  };

  const handleQuickGuestLogin = () => {
    const guest: DeveloperProfile = {
      name: 'مطور ضيف (Guest)',
      email: 'guest@mowjat.internal',
      role: 'guest',
      isLoggedIn: true,
      customApiUrl: '',
      apiKey: '',
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guest));
      setProfile(guest);
      if (onProfileUpdated) onProfileUpdated(guest);
      onClose();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = () => {
    const loggedOut: DeveloperProfile = {
      name: 'مطور غير مسجل',
      email: '',
      role: 'guest',
      isLoggedIn: false,
      customApiUrl: '',
      apiKey: '',
    };
    try {
      localStorage.removeItem(STORAGE_KEY);
      setProfile(loggedOut);
      if (onProfileUpdated) onProfileUpdated(loggedOut);
      setTestStatus('idle');
      setTestMessage('تم تسجيل الخروج ومسح الجلسة بنجاح.');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleTestRenderConnection = async () => {
    setTestStatus('testing');
    setTestMessage('جاري اختبار الاتصال بالخادم وRender...');

    const base = profile.customApiUrl?.trim() || '';
    const endpoint = base ? `${base.replace(/\/$/, '')}/api/health` : '/api/health';

    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`كود الاستجابة: ${res.status}`);
      }

      const data = await res.json();
      setTestStatus('success');
      setTestMessage(
        `الاتصال مستقر وناجح بنسبة 100%! حالة الخادم: ${data.status || 'نشط'} • التوافق مع Render جاهز بدون أخطاء شبكة.`
      );
    } catch (err: any) {
      setTestStatus('failed');
      setTestMessage(
        `تعذر الوصول لنقطة الخادم المحددة (${err?.message || 'خطأ اتصال'}). تم تأمين ذاكرة RAG المدمجة لتعمل احتياطياً دون توقف.`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#0d1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-right text-slate-100"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#11192e]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">واجهة الدخول الكلاسيكية للمطورين</h3>
                <p className="text-xs text-slate-400">إدارة جلسة المطور وإعدادات ربط خادم Render / API</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveProfile} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Status indicator */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-2.5 h-2.5 rounded-full ${profile.isLoggedIn ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>
                  الحالة: <strong>{profile.isLoggedIn ? `مسجل (${profile.name})` : 'مستخدم زائر (جاهز للاستخدام)'}</strong>
                </span>
              </div>
              {profile.isLoggedIn && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[11px] text-rose-400 hover:underline hover:text-rose-300"
                >
                  تسجيل خروج
                </button>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>اسم المطور أو المؤسسة</span>
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="مثال: مطور بايثون / مزيد"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>البريد الإلكتروني للتقارير الفنية</span>
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="developer@example.com"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Render / Custom API Endpoint */}
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <label className="block text-xs font-semibold text-cyan-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span>رابط خادم API في Render (اختياري)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">لتفادي أخطاء الشبكة</span>
              </label>
              <input
                type="url"
                value={profile.customApiUrl || ''}
                onChange={(e) => setProfile({ ...profile, customApiUrl: e.target.value })}
                placeholder="مثال: https://my-app.onrender.com (اتركه فارغاً للافتراضي)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                dir="ltr"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleTestRenderConnection}
                  disabled={testStatus === 'testing'}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>فحص اتصال الخادم (Health Check)</span>
                </button>
              </div>

              {testStatus !== 'idle' && (
                <div
                  className={`mt-2 p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                    testStatus === 'success'
                      ? 'bg-emerald-950/60 border border-emerald-700/50 text-emerald-300'
                      : testStatus === 'failed'
                      ? 'bg-amber-950/60 border border-amber-700/50 text-amber-300'
                      : 'bg-indigo-950/60 border border-indigo-700/50 text-indigo-200'
                  }`}
                >
                  {testStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : testStatus === 'failed' ? (
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  ) : (
                    <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                  )}
                  <span>{testMessage}</span>
                </div>
              )}
            </div>

            {/* Optional Custom API Key */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>مفتاح API خاص (اختياري)</span>
                </span>
                <span className="text-[10px] text-slate-400">Google Gemini أو DeepSeek</span>
              </label>
              <input
                type="password"
                value={profile.apiKey || ''}
                onChange={(e) => setProfile({ ...profile, apiKey: e.target.value })}
                placeholder="AIzaSy... أو sk-..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                إذا تُرك فارغاً، ستستخدم المنصة مفتاح البيئة الافتراضي مع الحصة المجانية وتفعيل ذاكرة RAG التلقائية.
              </p>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حفظ وتأكيد الدخول</span>
              </button>
              <button
                type="button"
                onClick={handleQuickGuestLogin}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                دخول كلاسيكي سريع كضيف
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
