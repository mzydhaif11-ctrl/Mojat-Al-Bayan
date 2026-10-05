// lib/ragEngine.ts - ذاكرة RAG الموسعة والتوثيق التقني الرسمي (API Docs) ومحرك التحكيم

export interface RAGDocument {
  id: string;
  title: string;
  category: 'gemini' | 'deepseek' | 'comparison' | 'pricing' | 'sdk' | 'api-docs';
  keywords: string[];
  content: string;
}

export const RAG_KNOWLEDGE_BASE: RAGDocument[] = [
  {
    id: 'gemini-models-core',
    title: 'عائلة نماذج Google Gemini 3.8 Flash و Gemini 3.1 Pro',
    category: 'gemini',
    keywords: ['gemini', 'flash', 'pro', '3.8', '3.1', 'نماذج', 'سياق', 'مودل'],
    content: `• Gemini 3.8 Flash: أحدث نموذج فائق السرعة من Google مع زمن استجابة قياسي (~0.4 ثانية)، ونافذة سياق تصل إلى 1,000,000 رمز. مصمم للشات الحي وتطبيقات الويب والإنتاج اليومي.
• Gemini 3.1 Pro: النموذج الرائد في الاستدلال المعقد والتحليل العميق وكتابة الشيفرات البرمجية الكبيرة، بسياق هائل يصل إلى 2,000,000 رمز (tokens).
• Gemini 3.1 Flash-Lite: أسرع النماذج وأقلها تكلفة للعمليات المتكررة فائقة الضخامة وتصنيف البيانات.`,
  },
  {
    id: 'gemini-api-reference',
    title: 'التوثيق الفني الكامل لـ Google Gemini API (Parameters & Config)',
    category: 'api-docs',
    keywords: ['gemini api', 'parameters', 'temperature', 'streaming', 'caching', 'معاملات', 'توثيق'],
    content: `• حزمة SDK الرسمية: @google/genai (Node.js/TS) و google-genai (Python).
• تهيئة العميل:
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
• أهم معاملات التكوين (GenerateContentConfig):
  - systemInstruction: توجيه سلوك وشخصية النموذج.
  - temperature (0.0 إلى 2.0): 0.2 للمهام الدقيقة والكود، 0.7 للمحادثات العامة.
  - maxOutputTokens: الحد الأقصى لطول المخرجات.
  - responseMimeType: "application/json" لإرجاع بيانات JSON مهيكلة.
  - responseSchema: التحقق من بنية المخرجات.
• البث المباشر (Streaming): ai.models.generateContentStream({ model, contents })
• خاصية Context Caching:
ai.caches.create({ model: 'gemini-3.8-flash', config: { ttl: '300s' }, contents: [...] })`,
  },
  {
    id: 'deepseek-models-core',
    title: 'عائلة نماذج DeepSeek V3 و DeepSeek R1',
    category: 'deepseek',
    keywords: ['deepseek', 'v3', 'r1', 'moe', 'استدلال', 'تفكير', 'معمارية'],
    content: `• DeepSeek V3: نموذج مفتوح الأوزان بمعمارية خليط الخبراء (MoE) بإجمالي 671 مليار معلمة، يتم تفعيل 37 مليار معلمة فقط لكل رمز، مما يوفر سرعة استجابة عالية وتكلفة منخفضة.
• DeepSeek R1: نموذج استدلالي تم تدريبه بالتعلم المعزز النقي (RL) للتفكير المتأني ومسار الاستدلال خطوة بخطوة (Chain of Thought)، متفوق في البرمجة والرياضيات المعقدة.
• التوافق: يدعم DeepSeek واجهة برمجية متوافقة بالكامل مع مكتبة OpenAI الرسمية.`,
  },
  {
    id: 'deepseek-api-reference',
    title: 'التوثيق الفني الكامل لـ DeepSeek API (Endpoints & Models)',
    category: 'api-docs',
    keywords: ['deepseek api', 'endpoint', 'base_url', 'deepseek-chat', 'deepseek-reasoner', 'openai'],
    content: `• نقطة النهاية الأساسية (Base URL): https://api.deepseek.com
• نماذج API المتاحة:
  1. deepseek-chat: نموذج DeepSeek-V3 للأغراض العامة والبرمجة السريعة.
  2. deepseek-reasoner: نموذج DeepSeek-R1 للاستدلال المنطقي وإظهار حقل reasoning_content.
• كود الربط المعتمد عبر OpenAI SDK:
from openai import OpenAI
client = OpenAI(api_key=os.environ.get("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com")
response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[{"role": "user", "content": "حل المسألة البرمجية"}],
    stream=False
)
# قراءة التفكير الاستدلالي: response.choices[0].message.reasoning_content
# قراءة الإجابة النهائية: response.choices[0].message.content`,
  },
  {
    id: 'python-sdk-gemini',
    title: 'الربط البرمجي مع Python ومكتبة google-genai',
    category: 'sdk',
    keywords: ['بايثون', 'python', 'كود', 'sdk', 'google-genai', 'مكتبة', 'تثبيت'],
    content: `• التثبيت: pip install google-genai
• الاستدعاء:
from google import genai
import os

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="اكتب نصيحة تقنية",
)
print(response.text)
• البث المباشر (Streaming): client.models.generate_content_stream(...)`,
  },
  {
    id: 'pricing-and-free-tier',
    title: 'الأسعار والحصة المجانية في Google AI Studio و DeepSeek',
    category: 'pricing',
    keywords: ['سعر', 'اسعار', 'تكلفة', 'مجاني', 'quota', 'free', 'حدود', 'rpm', 'tpm'],
    content: `• الحصة المجانية في AI Studio: تمنح Google حتى 15 طلب بالدقيقة (RPM) و 1M رمز بالدقيقة (TPM) و 1,500 طلب يومياً مجاناً بدون بطاقة دفع.
• Gemini 3.8 Flash (مدفوع): 0.10$ لكل مليون رمز إدخال و 0.40$ لكل مليون رمز إخراج.
• Gemini 3.1 Pro (مدفوع): 1.25$ لكل مليون رمز إدخال و 5.00$ لكل مليون رمز إخراج.
• DeepSeek V3: حوالي 0.14$ لكل مليون رمز إدخال و 0.28$ لكل مليون رمز إخراج.
• Context Caching في Gemini: خصم حتى 75% من تكلفة المدخلات الطويلة المتكررة.`,
  },
  {
    id: 'gemini-error-handling-guide',
    title: 'دليل معالجة أخطاء Google Gemini API والتعافي التلقائي',
    category: 'api-docs',
    keywords: ['خطأ', 'أخطاء', 'error', '429', 'rate limit', '503', 'overloaded', 'quota', 'استثناء'],
    content: `• كود 429 (Resource Exhausted / Rate Limit):
  - السبب: تجاوز حد الطلبات بالدقيقة (15 RPM للخطة المجانية).
  - الحل: استخدام تقنية التراجع الأسي (Exponential Backoff) أو تفعيل الفوترة لرفع الحد إلى 1000+ RPM.
• كود 503 / 500 (Service Unavailable / Overloaded):
  - السبب: ضغط مؤقت على الخوادم السحابية.
  - الحل: المحاولة التلقائية بعد 1-2 ثانية أو التوجيه لنموذج بديل مثل Gemini 3.1 Flash-Lite.
• أخطاء الشبكة (Network Error / Fetch Failed):
  - يتم استرجاع ذاكرة RAG محلياً فوراً لمنع توقف تجربة المستخدم وإظهار إجابة دقيقة من التوثيق المخزن.`,
  },
  {
    id: 'deepseek-reasoning-api-guide',
    title: 'التوثيق الفني لقراءة التفكير الاستدلالي في DeepSeek R1 API',
    category: 'api-docs',
    keywords: ['deepseek r1', 'reasoning_content', 'chain of thought', 'تفكير', 'استدلال api'],
    content: `• نموذج deepseek-reasoner:
  - يقوم بإنشاء مسار التفكير المنطقي أولاً في الحقل الخاص: response.choices[0].message.reasoning_content
  - ثم يُرجع الإجابة النهائية الموجهة للمستخدم في الحقل: response.choices[0].message.content
• معاملات التحكم الموصى بها:
  - لا تقم بتعيين temperature مخصصة لـ R1؛ التوثيق الرسمي يوصي بتركها افتراضية (1.0) أو ما يقاربها للحصول على أفضل دقة برهانية.
  - الحجم الأقصى للسياق: 64,000 رمز للمدخلات، و 8,000 رمز للتفكير الاستدلالي.`,
  },
  {
    id: 'render-network-deployment',
    title: 'إرشادات النشر على Render وتفادي أخطاء الشبكة والـ Timeouts',
    category: 'api-docs',
    keywords: ['render', 'network error', 'timeout', 'نشر', 'deployment', 'فشل', 'بورت', 'port'],
    content: `• حلول أخطاء الشبكة في Render (Network Error / Cold Start):
1. ضبط منفذ التشغيل (Port): يتطلب Render قراءة متغير البيئة PORT تلقائياً (مثلاً: next start -p $PORT أو PORT=3000).
2. منصة Render (الخطة المجانية) تضع الخادم في حالة خمول (Spin Down) بعد 15 دقيقة، وتستغرق الاستفاقة 40-50 ثانية.
3. النظام مزوّد بآلية تعافي تلقائي تعتمد على ذاكرة RAG المحلية لتوليد الرد فوراً عند تعذر الاتصال بالخادم.
4. التأكد من إضافة GEMINI_API_KEY في صفحة Environment Variables على لوحة تحكم Render.
5. نقطة فحص الصحة /api/health متاحة لمراقبة حالة الخادم بنجاح.`,
  },
  {
    id: 'classic-html-auth-guide',
    title: 'دليل واجهة الدخول الكلاسيكية وتخزين الجلسات (Classic HTML Auth)',
    category: 'api-docs',
    keywords: ['دخول', 'تسجيل', 'واجهة كلاسيكية', 'auth', 'login', 'جلسة', 'مفتاح'],
    content: `• معايير واجهة الدخول الكلاسيكية المعتمدة:
1. نموذج HTML بسيط ونظيف بدون تعقيدات خارجية: حقول البريد، اسم المطور، ومفتاح API اختياري.
2. حفظ بيانات المطور محلياً في localStorage لاستمرار الجلسة واستعادتها بسلاسة عبر التحديثات.
3. إمكانية الدخول السريع كـ "مطور زائر" مع صلاحيات كاملة للاستفادة من الذاكرة والدردشة.
4. إتاحة زر تسجيل الخروج / التبديل في أي وقت بنقرة واحدة.`,
  },
  {
    id: 'hybrid-model-routing',
    title: 'استراتيجية التوجيه الهجين بين النماذج (Model Arbiter)',
    category: 'comparison',
    keywords: ['مقارنة', 'افضل', 'أفضل', 'توجيه', 'اختيار', 'routing', 'arbiter', 'flash vs pro'],
    content: `• قاعدة التوجيه الأفضل:
1. استخدم Gemini 3.8 Flash للمهام الفورية، الشات الحي، التلخيص، والسياق الطويل (>500k).
2. استخدم DeepSeek R1 للمسائل الرياضية المعقدة والاستدلال المنطقي متعدد الخطوات.
3. استخدم DeepSeek V3 للمشاريع مفتوحة المصدر أو الراغبة في استقلالية البنية التحتية.
4. التوجيه الذكي يوفر ما يصل إلى 80% من النفقات السحابية.`,
  },
];

export interface RetrievedRAGResult {
  matchedDocs: RAGDocument[];
  contextText: string;
}

export function retrieveRAGContext(query: string, maxResults = 3): RetrievedRAGResult {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(t => t.length > 2);

  const scored = RAG_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    for (const kw of doc.keywords) {
      if (q.includes(kw.toLowerCase())) score += 5;
    }
    for (const token of tokens) {
      if (doc.content.toLowerCase().includes(token)) score += 1;
      if (doc.title.toLowerCase().includes(token)) score += 3;
    }
    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matchedDocs = scored.slice(0, maxResults).map(s => s.doc);
  const contextText = matchedDocs.map(d => `### مصادر الذاكرة التقنية (${d.title}):\n${d.content}`).join('\n\n');

  return { matchedDocs, contextText };
}

export interface ModelEvaluation {
  bestModelName: string;
  bestModelProvider: 'Google Gemini' | 'DeepSeek';
  reason: string;
  badgeColor: string;
  geminiPerspective: string;
  deepseekPerspective: string;
}

export function evaluateBestModelForQuery(query: string): ModelEvaluation {
  const q = query.toLowerCase();

  // Reasoning, Math, Logic puzzles, R1
  if (
    q.includes('استدلال') ||
    q.includes('تفكير') ||
    q.includes('رياضيات') ||
    q.includes('r1') ||
    q.includes('منطق') ||
    q.includes('برهان') ||
    q.includes('خوارزمية') ||
    q.includes('reasoning') ||
    q.includes('chain of thought')
  ) {
    return {
      bestModelName: 'DeepSeek R1',
      bestModelProvider: 'DeepSeek',
      reason: 'النموذج الأفضل لهذه المهمة نظراً لتدريبه بالتعلم المعزز النقي (RL) وقدرته الفائقة على الاستدلال المنطقي والتفكير المتسلسل وإظهار خطوات reasoning_content.',
      badgeColor: 'blue',
      geminiPerspective: 'Gemini 3.1 Pro يقدم استدلالاً قوياً بسياق هائل (2M رمز)، بينما يتفوق R1 في إظهار تفكير الخطوات والتدقيق الذاتي.',
      deepseekPerspective: 'DeepSeek R1 تم تدريبه بالتعلم المعزز خصيصاً للرياضيات والبرمجة الاستدلالية مع تبرير كل خطوة.',
    };
  }

  // MoE, Open Source, Self hosting
  if (q.includes('moe') || q.includes('مفتوح') || q.includes('معمارية') || q.includes('خبراء') || q.includes('v3')) {
    return {
      bestModelName: 'DeepSeek V3',
      bestModelProvider: 'DeepSeek',
      reason: 'النموذج الأفضل لشرح وتطبيق معمارية خليط الخبراء (MoE) بحجم 671 مليار معلمة واستخدام 37B رمز نشط فقط بكفاءة خارقة.',
      badgeColor: 'cyan',
      geminiPerspective: 'Google توظف معمارية متقدمة في Gemini 3.8 Flash لتحقيق سرعة خيالية، مع المحافظة على تكلفة منخفضة ($0.10).',
      deepseekPerspective: 'DeepSeek V3 رائد في توفير بنية MoE مفتوحة الأوزان بأداء ينافس أقوى النماذج المغلقة وتوافق تام مع مكتبة OpenAI.',
    };
  }

  // Python SDK, Speed, Low Latency, Quota, Context Caching, General Dev
  if (
    q.includes('بايثون') ||
    q.includes('python') ||
    q.includes('sdk') ||
    q.includes('google-genai') ||
    q.includes('سرعة') ||
    q.includes('سياق') ||
    q.includes('caching') ||
    q.includes('مجاني') ||
    q.includes('سعر') ||
    q.includes('تكلفة')
  ) {
    return {
      bestModelName: 'Gemini 3.8 Flash',
      bestModelProvider: 'Google Gemini',
      reason: 'النموذج الأفضل سرعةً وتكلفةً مع دعم مكتبة google-genai الرسمية والحصة المجانية (15 RPM) ونافذة سياق مليونية وخاصية Context Caching.',
      badgeColor: 'emerald',
      geminiPerspective: 'Gemini 3.8 Flash يمنحك استجابة فورية (~0.4s)، سياق 1M رمز، وميزة Context Caching التي توفر 75% من تكلفة المدخلات.',
      deepseekPerspective: 'DeepSeek V3 منافس قوي بأسعار منخفضة، إلا أن Gemini Flash يتفوق في سرعة زمن الاستجابة ودعم Google AI Studio المباشر.',
    };
  }

  // Default optimal arbiter choice
  return {
    bestModelName: 'Gemini 3.8 Flash',
    bestModelProvider: 'Google Gemini',
    reason: 'تم اختياره كأفضل استجابة متوازنة تجمع بين السرعة الفائقة، دقة المعلومات الفنية، وحداثة البيانات التقنية.',
    badgeColor: 'indigo',
    geminiPerspective: 'Gemini 3.8 Flash الخيار الافتراضي الأكثر ملاءمة لمعظم استفسارات المطورين بفضل سرعته وسعة سياقه.',
    deepseekPerspective: 'يمكن استخدام DeepSeek كبديل ممتاز عند الرغبة في التوافق المباشر مع واجهات OpenAI أو استخدام أوزان مفتوحة.',
  };
}
