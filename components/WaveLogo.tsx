'use client';

import React from 'react';

interface WaveLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WaveLogo({ size = 'md', className = '' }: WaveLogoProps) {
  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-600/40 via-purple-600/30 to-blue-500/30 blur-xl opacity-80" />
      
      {/* Main squircle container matching screenshot */}
      <div
        className={`relative ${sizeMap[size]} rounded-[28px] bg-gradient-to-b from-[#6366f1] via-[#7c3aed] to-[#4f46e5] p-[2px] shadow-2xl shadow-indigo-500/25 flex items-center justify-center overflow-hidden`}
      >
        {/* Inner subtle bevel */}
        <div className="w-full h-full rounded-[26px] bg-gradient-to-br from-[#818cf8] via-[#6366f1] to-[#4338ca] flex items-center justify-center p-3 relative overflow-hidden">
          {/* Subtle light reflection overlay */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/25 rounded-full blur-md pointer-events-none" />

          {/* Detailed The Great Wave of Kanagawa Style SVG */}
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            {/* Background Sky / Spray particles */}
            <circle cx="28" cy="40" r="1.5" fill="#f8fafc" opacity="0.9" />
            <circle cx="36" cy="32" r="1.2" fill="#f8fafc" opacity="0.8" />
            <circle cx="48" cy="24" r="1.8" fill="#f8fafc" opacity="0.9" />
            <circle cx="58" cy="20" r="1.5" fill="#f8fafc" opacity="0.85" />
            <circle cx="68" cy="26" r="1.2" fill="#f8fafc" opacity="0.8" />
            <circle cx="82" cy="38" r="1.5" fill="#f8fafc" opacity="0.7" />

            {/* Back ocean wave swell */}
            <path
              d="M10 88C30 84 45 76 60 78C78 80 92 90 110 88V110H10V88Z"
              fill="#1e3a8a"
              opacity="0.85"
            />
            {/* Deep mid wave curve */}
            <path
              d="M12 94C28 92 48 86 64 88C82 90 96 98 108 96V110H12V94Z"
              fill="#2563eb"
            />

            {/* Main Great Wave crest curling inward */}
            <path
              d="M16 100C16 100 24 82 34 68C42 56 50 45 62 38C72 32 84 34 88 42C91 48 86 56 78 58C70 60 62 55 58 48C56 44 57 40 59 38"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main wave body */}
            <path
              d="M12 104C18 90 28 72 40 58C52 44 68 36 82 40C88 42 88 48 80 52C68 56 54 66 48 76C42 86 38 98 34 104H12Z"
              fill="#1d4ed8"
            />

            {/* Wave claw crests (white water foam) */}
            <path
              d="M74 37C76 34 82 35 84 39C86 43 82 48 76 50C70 52 64 50 62 46C60 42 63 38 67 36C70 34 74 35 76 38"
              fill="#f8fafc"
            />
            <path
              d="M52 46C56 42 62 43 65 47C67 50 64 54 59 56C55 57 51 55 50 52C49 49 50 47 52 46Z"
              fill="#ffffff"
            />
            <path
              d="M40 58C44 54 48 55 51 59C53 63 50 68 45 70C41 71 38 68 38 65C38 62 39 59 40 58Z"
              fill="#f8fafc"
            />

            {/* Foamy crest fingers / sprays */}
            <path
              d="M62 37L60 32M68 35L70 30M74 38L78 33M82 43L87 40"
              stroke="#f8fafc"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Wave foam lines */}
            <path
              d="M32 78C38 72 48 68 56 68C66 68 76 74 84 76"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M25 88C34 82 48 80 58 82C68 84 78 88 88 88"
              stroke="#bfdbfe"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M18 98C28 94 42 92 56 94C70 96 82 100 96 98"
              stroke="#e0f2fe"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Bottom foam highlight */}
            <path
              d="M10 102C26 98 46 96 66 98C86 100 102 104 112 102V108H10V102Z"
              fill="#f8fafc"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
