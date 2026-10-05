import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-3xl font-bold mb-2">٤٠٤ - الصفحة غير موجودة</h2>
      <p className="text-slate-400 mb-6">عذراً، الصفحة التي تبحث عنها غير متوفرة في منصة موجة البيان.</p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-sm"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
