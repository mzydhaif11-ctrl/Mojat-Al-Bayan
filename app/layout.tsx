import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'منصة موجة البيان | الدعم الفني لنماذج الذكاء الاصطناعي',
  description: 'منصتك المتخصصة في الدعم الفني لنماذج الذكاء الاصطناعي من Google Gemini و DeepSeek. اختر سؤالاً مقترحاً أو ابدأ محادثتك مباشرة.',
  openGraph: {
    title: 'منصة موجة البيان | الدعم الفني لنماذج الذكاء الاصطناعي',
    description: 'منصتك المتخصصة في الدعم الفني لنماذج الذكاء الاصطناعي من Google Gemini و DeepSeek.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'منصة موجة البيان | الدعم الفني لنماذج الذكاء الاصطناعي',
    description: 'منصتك المتخصصة في الدعم الفني لنماذج الذكاء الاصطناعي من Google Gemini و DeepSeek.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-[#080b11] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
