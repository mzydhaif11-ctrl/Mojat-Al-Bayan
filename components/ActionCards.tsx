'use client';

import React from 'react';
import { motion } from 'motion/react';

export interface CardAction {
  id: 'models' | 'python' | 'comparison' | 'pricing';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  badge?: string;
}

interface ActionCardsProps {
  onSelectCard: (id: CardAction['id']) => void;
  activeId?: string | null;
}

export function ActionCards({ onSelectCard, activeId }: ActionCardsProps) {
  const cards: CardAction[] = [
    {
      id: 'models',
      title: 'النماذج المتوفرة',
      subtitle: 'تعرف على أحدث إصدارات Gemini ومقارنتها',
      icon: (
        <span className="text-2xl filter drop-shadow-sm select-none" role="img" aria-label="sparkles">
          ✨
        </span>
      ),
      accentColor: 'from-amber-500/20 to-indigo-500/10',
      badge: 'إصدار 3.8',
    },
    {
      id: 'python',
      title: 'البدء مع Python',
      subtitle: 'مثال عملي لربط Gemini بـ Python',
      icon: (
        <span className="text-2xl filter drop-shadow-sm select-none" role="img" aria-label="python">
          🐍
        </span>
      ),
      accentColor: 'from-emerald-500/20 to-blue-500/10',
      badge: 'SDK رسمي',
    },
    {
      id: 'comparison',
      title: 'Flash vs Pro',
      subtitle: 'مقارنة شاملة بين النماذج',
      icon: (
        <span className="text-2xl filter drop-shadow-sm select-none" role="img" aria-label="lightning">
          ⚡
        </span>
      ),
      accentColor: 'from-yellow-500/20 to-amber-500/10',
      badge: 'مقارنة مباشرة',
    },
    {
      id: 'pricing',
      title: 'الحدود والأسعار',
      subtitle: 'تفاصيل الأسعار والقيود لكل نموذج',
      icon: (
        <div className="flex items-end gap-[3px] h-6 py-0.5 select-none" aria-label="bar chart">
          <div className="w-1.5 h-3 bg-red-400 rounded-xs" />
          <div className="w-1.5 h-4.5 bg-blue-400 rounded-xs" />
          <div className="w-1.5 h-2 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-5 bg-indigo-400 rounded-xs" />
        </div>
      ),
      accentColor: 'from-cyan-500/20 to-indigo-500/10',
      badge: 'حاسبة التكلفة',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 w-full max-w-md mx-auto">
      {cards.map((card) => {
        const isActive = activeId === card.id;

        return (
          <motion.div
            key={card.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectCard(card.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCard(card.id);
              }
            }}
            whileHover={{ scale: 1.025, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`group relative text-right p-4 rounded-[22px] transition-all duration-200 border cursor-pointer flex flex-col justify-between h-[138px] overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              isActive
                ? 'bg-[#182033] border-indigo-500/80 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/40'
                : 'bg-[#111624]/90 hover:bg-[#151c2e] border-slate-800/80 hover:border-slate-700 shadow-md shadow-black/40'
            }`}
          >
            {/* Subtle internal gradient glow on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />

            {/* Top row: Icon and subtle status indicator */}
            <div className="flex items-center justify-between w-full relative z-10">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800/60 border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                {card.icon}
              </div>

              {card.badge && (
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">
                  {card.badge}
                </span>
              )}
            </div>

            {/* Bottom block: Title & Subtitle */}
            <div className="relative z-10 space-y-1 mt-auto">
              <h3 className="text-[15px] font-bold text-slate-100 tracking-tight group-hover:text-white transition-colors">
                {card.title}
              </h3>
              <p className="text-[11px] leading-relaxed text-slate-400 group-hover:text-slate-300 line-clamp-2 transition-colors">
                {card.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
