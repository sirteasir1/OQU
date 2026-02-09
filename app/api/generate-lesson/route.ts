import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateWithGemini } from '@/lib/geminiClient';
import { LessonContent } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topicId, topicTitle, topicDescription, subject, grade, level, userInterests } = await request.json();

    if (!topicId || !topicTitle || !subject || !Array.isArray(userInterests) || userInterests.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // subject-specific validation
    if (subject === 'math' && !grade) {
      return NextResponse.json({ error: 'Missing grade for math lesson' }, { status: 400 });
    }
    if (subject === 'english' && !level) {
      return NextResponse.json({ error: 'Missing level for english lesson' }, { status: 400 });
    }

    const isEnglish = subject === 'english';

    const isProgramming = subject === 'python' || subject === 'cpp';
    const languageLabel = subject === 'python' ? 'Python' : subject === 'cpp' ? 'C++' : '';

    const prompt = isEnglish
      ? `Ты профессиональный преподаватель английского языка.

Сделай мини-урок в виде 10 карточек по теме. Карточки должны быть короткие, понятные, без воды.

**ОБ УЧЕНИКЕ:**
- Уровень: ${level} (ориентируйся на этот уровень)
- Интересы: ${userInterests.join(', ')}

**ТЕМА УРОКА:**
- ${topicTitle}
- Описание/контекст: ${topicDescription || '—'}

**ТРЕБОВАНИЯ К КАРТОЧКАМ (10 шт.):**
1) Карточка 1: type = "metaphor". Дай интересную аналогию/историю, связанную с ЛЮБЫМ интересом ученика, чтобы было "вау".
2) Карточки 2–7: type = "theory". Объясняй шаг за шагом. Пиши на русском. Вставляй короткие примеры на английском (2–5 примеров в сумме на карточку).
3) Карточки 8–10: type = "example". Дай 3 задания/мини-упражнения уровня ${level}. Обязательно дай краткое решение/ответ.

**СТИЛЬ:**
- Каждый card.content: 3–7 предложений.
- Можно использовать нумерацию, списки.
- Варьируй интересы между карточками (если их несколько).
- Если тема про лексику/навыки (reading/writing/listening) — добавляй мини-стратегии и примеры.

Верни ТОЛЬКО валидный JSON строго по структуре:
{
  "topicId": "${topicId}",
  "interest": "строка (например, один из интересов или 'Смешанная тема')",
  "cards": [
    {
      "id": "card-1",
      "title": "Заголовок",
      "content": "Текст",
      "type": "metaphor" | "theory" | "example"
    }
  ]
}

ВАЖНО: никакого Markdown, никаких пояснений, только JSON.`
      : isProgramming
      ? `Ты профессиональный преподаватель программирования.

Сделай мини-урок в виде 10 карточек по теме. Карточки должны быть короткие, понятные, без воды, на русском языке.
Это курс по ${languageLabel}.

**ОБ УЧЕНИКЕ:**
- Интересы: ${userInterests.join(', ')}

**ТЕМА УРОКА:**
- ${topicTitle}
- Описание/контекст: ${topicDescription || '—'}

**ТРЕБОВАНИЯ К КАРТОЧКАМ (10 шт.):**
1) Карточка 1: type="metaphor". Мотивационная аналогия/пример через один из интересов ученика (спорт/игры/музыка и т.д.).
2) Карточки 2–7: type="theory". Объясни ключевые правила и типовые ошибки новичков. Дай мини-примеры кода на ${languageLabel} (короткие, 1–6 строк).
3) Карточки 8–10: type="example". Дай 3 практических мини-задания (формата «что выведет?», «где ошибка?», «какая строка правильная?») и ОБЯЗАТЕЛЬНО дай краткий правильный ответ.

**СТИЛЬ:**
- Каждый card.content: 3–7 предложений.
- Без сложной теории, упор на понятность.
- Примеры кода без Markdown (просто текст в content).

Верни ТОЛЬКО валидный JSON строго по структуре:
{
  "topicId": "${topicId}",
  "interest": "строка (например, один из интересов или 'Смешанная тема')",
  "cards": [
    {
      "id": "card-1",
      "title": "Заголовок",
      "content": "Текст",
      "type": "metaphor" | "theory" | "example"
    }
  ]
}

ВАЖНО: никакого Markdown, никаких пояснений, только JSON.`
      : `Ты профессиональный учитель математики.

Сделай мини-урок в виде 10 карточек по теме. Карточки должны быть короткие, понятные, без воды, на русском языке.

**ОБ УЧЕНИКЕ:**
- Класс: ${grade}
- Интересы: ${userInterests.join(', ')}

**ТЕМА УРОКА:**
- ${topicTitle}
- Описание/контекст: ${topicDescription || '—'}

**ТРЕБОВАНИЯ К КАРТОЧКАМ (10 шт.):**
1) Карточка 1: type = "metaphor". Дай интересную аналогию/историю, связанную с ЛЮБЫМ интересом ученика, чтобы было "вау".
2) Карточки 2–7: type = "theory". Объясняй шаг за шагом, очень понятно. Дай формулы/правила, если нужно.
3) Карточки 8–10: type = "example". Дай 3 практических задания уровня ${grade} класса и краткое решение/ответ.

**СТИЛЬ:**
- Каждый card.content: 3–7 предложений.
- Можно использовать нумерацию, списки.
- Варьируй интересы между карточками для разнообразия.

Верни ТОЛЬКО валидный JSON строго по структуре:
{
  "topicId": "${topicId}",
  "interest": "строка (например, один из интересов или 'Смешанная тема')",
  "cards": [
    {
      "id": "card-1",
      "title": "Заголовок",
      "content": "Текст",
      "type": "metaphor" | "theory" | "example"
    }
  ]
}

ВАЖНО: никакого Markdown, никаких пояснений, только JSON.`;

    const responseText = await generateWithGemini({
      model: 'gemini-2.5-flash',
      prompt,
      temperature: 0.7,
    });

    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    let lesson: LessonContent;
    try {
      lesson = JSON.parse(jsonText);
    } catch (err) {
      console.error('Lesson JSON parse error:', err);
      console.error('Response preview:', responseText.slice(0, 300));
      return NextResponse.json({ error: 'AI returned invalid format. Please try again.' }, { status: 500 });
    }

    if (!lesson?.cards || !Array.isArray(lesson.cards) || lesson.cards.length === 0) {
      return NextResponse.json({ error: 'AI generated incomplete lesson. Please try again.' }, { status: 500 });
    }

    // Normalize ids if missing
    lesson.cards = lesson.cards.map((c: any, idx: number) => ({
      id: c.id || `card-${idx + 1}`,
      title: String(c.title ?? `Карточка ${idx + 1}`),
      content: String(c.content ?? ''),
      type: (c.type === 'metaphor' || c.type === 'theory' || c.type === 'example') ? c.type : 'theory',
    }));

    lesson.topicId = topicId;
    lesson.interest = typeof lesson.interest === 'string' && lesson.interest.trim() ? lesson.interest : 'Смешанная тема';

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error('Lesson generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
