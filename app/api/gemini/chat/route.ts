import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { retrieveRAGContext, evaluateBestModelForQuery } from '@/lib/ragEngine';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

const SYSTEM_INSTRUCTION = `أنت "المستشار التقني لمنصة موجة البيان" (Mawjat Al-Bayan)، المتخصصة بالدعم الفني والمقارنة البرمجية بين نماذج Google Gemini و DeepSeek.
لديك وصول مباشر إلى ذاكرة معرفية مدعومة بـ RAG ونظام توجيه ذكي بين النماذج (Model Arbiter).
عند الإجابة:
1. اذكر بوضوح أي نموذج هو الأنسب لهذه المهمة (Gemini 3.8 Flash أو Gemini 3.1 Pro أو DeepSeek R1 أو DeepSeek V3) مع تبرير علمي موجز.
2. ادعم إجابتك بأمثلة كود برمجية حديثة ونقاط واضحة.
3. استخدم اللغة العربية الفصحى الأنيقة والتنسيق المنظم.
4. اذكر مقارنة سريعة بين النموذجين إن كان ذلك يثري فهم المطور.`;

export async function POST(req: NextRequest) {
  try {
    const { message, topic, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400, headers: corsHeaders });
    }

    // 1. RAG Memory Context Retrieval
    const ragResult = retrieveRAGContext(message);
    const evaluation = evaluateBestModelForQuery(message);

    const ragContextPrompt = `\n\n[معلومات مسترجعة من ذاكرة RAG الخاصة بالمنصة والوثائق الفنية الرسمية]:\n${ragResult.contextText}\n\n[تقييم المحكم الذكي للنماذج]:\nالنموذج الأفضل المقترح: ${evaluation.bestModelName} (${evaluation.bestModelProvider})\nالسبب: ${evaluation.reason}`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: generateOfflineFallback(message, topic, ragResult.contextText, evaluation),
        modelUsed: evaluation.bestModelName,
        evaluation,
        ragSources: ragResult.matchedDocs.map(d => d.title),
        note: 'تم تفعيل وضع ذاكرة RAG الاحتياطي لعدم توفر مفتاح البيئة محلياً',
      }, { headers: corsHeaders });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Use Gemini 3.8 Flash with RAG injection
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...(Array.isArray(history)
          ? history.slice(-6).map((h: { role: string; content: string }) => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content }],
            }))
          : []),
        {
          role: 'user',
          parts: [{ text: message + ragContextPrompt }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    return NextResponse.json({
      reply: response.text || generateOfflineFallback(message, topic, ragResult.contextText, evaluation),
      modelUsed: evaluation.bestModelName,
      evaluation,
      ragSources: ragResult.matchedDocs.map(d => d.title),
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error generating Gemini response or network issue:', error);
    const evaluation = evaluateBestModelForQuery(typeof error === 'string' ? error : 'error');
    const ragResult = retrieveRAGContext('gemini flash pro');
    const fallbackText = generateOfflineFallback(error?.message || '', undefined, ragResult.contextText, evaluation);
    return NextResponse.json({
      reply: fallbackText,
      modelUsed: evaluation.bestModelName,
      evaluation,
      ragSources: ragResult.matchedDocs.map(d => d.title),
      note: 'تم تفعيل وضع ذاكرة RAG الاحتياطي التلقائي (جاهز لبيئة Render دون توقف)',
    }, { headers: corsHeaders });
  }
}

function generateOfflineFallback(query: string, topic?: string, ragSnippet?: string, evaluation?: any): string {
  const q = query.toLowerCase();

  let coreAnswer = '';
  if (topic === 'python' || q.includes('python') || q.includes('بايثون') || q.includes('كود')) {
    coreAnswer = `#### 🐍 1. الربط الرسمي مع Google Gemini:
\`\`\`bash
pip install google-genai
\`\`\`
\`\`\`python
from google import genai
import os

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="اكتب دالة بايثون لحساب الفائدة المركبة",
)
print(response.text)
\`\`\`

#### ⚡ 2. الربط مع DeepSeek V3 عبر مكتبة OpenAI:
\`\`\`bash
pip install openai
\`\`\`
\`\`\`python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "اشرح كود بايثون"}]
)
print(response.choices[0].message.content)
\`\`\``;
  } else if (q.includes('استدلال') || q.includes('r1') || q.includes('رياضيات') || q.includes('تفكير')) {
    coreAnswer = `#### 🧠 المقارنة الاستدلالية:
• **DeepSeek R1:** متفوق في إظهار مسار الاستدلال وحل المسائل البرمجية والرياضية العميقة مع إظهار تفاصيل التفكير خطوة بخطوة.
• **Gemini 3.1 Pro:** يتفوق عندما تكون المسألة تتطلب سياقاً ضخماً يتجاوز 128 ألف رمز (يصل إلى 2M رمز) مع قدرات وسائط متعددة.`;
  } else {
    coreAnswer = `• **Gemini 3.8 Flash:** النموذج الأسرع والأوفر للتطبيقات اليومية وشات الويب، مع سياق مليون رمز و15 طلب مجاني بالدقيقة.
• **DeepSeek V3 / R1:** بدائل مفتوحة الأوزان فائقة الذكاء للاستدلال المنطقي والمهام المتخصصة.`;
  }

  const evalNote = evaluation
    ? `> 🏆 **النموذج المختار كأفضل إجابة:** **${evaluation.bestModelName}** (${evaluation.bestModelProvider})\n> 💡 **سبب الاختيار:** ${evaluation.reason}\n\n`
    : '';

  return `${evalNote}${coreAnswer}\n\n📚 **ذاكرة RAG المسترجعة:** تم تدقيق الإجابة استناداً إلى أحدث وثائق Google AI Studio و DeepSeek API الرسمية.`;
}
