'use client';

import React, { useEffect, useState } from 'react';

export function StatusBar() {
  const [timeStr, setTimeStr] = useState('٤:١٤');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      // Convert to Arabic-Indic digits
      const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      const formatted = `${hours}:${minutes}`.replace(/[0-9]/g, (d) => arabicDigits[parseInt(d, 10)]);
      setTimeStr(formatted);
    };

    const timer = setTimeout(updateTime, 100);
    const interval = setInterval(updateTime, 30000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      suppressHydrationWarning
      className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-xs font-semibold text-slate-300 select-none z-20"
    >
      {/* Left items: battery, network */}
      <div className="flex items-center gap-1.5 [direction:ltr]" suppressHydrationWarning>
        {/* Battery with percentage */}
        <div className="flex items-center gap-1">
          <div className="w-5 h-2.5 border border-slate-300 rounded-[3px] p-[1px] flex items-center relative">
            <div className="h-full bg-slate-200 rounded-[1px] w-[70%]" />
            <div className="w-[1.5px] h-1.5 bg-slate-300 rounded-r-[1px] absolute -right-[2.5px] top-[2px]" />
          </div>
          <span className="text-[10px] font-mono text-slate-300 tracking-tight">70</span>
        </div>

        {/* 4G */}
        <span className="text-[11px] font-bold text-slate-300 ml-1">4G</span>

        {/* Cellular Signal dots (4 dots) */}
        <div className="flex items-center gap-[2px] ml-1">
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <div className="w-1 h-1 rounded-full bg-slate-600" />
        </div>
      </div>

      {/* Right item: Arabic time 4:14 */}
      <div suppressHydrationWarning className="text-sm font-bold tracking-wider text-slate-200">
        {timeStr}
      </div>
    </div>
  );
}


