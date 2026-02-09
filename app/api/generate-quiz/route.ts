import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithGemini } from "@/lib/geminiClient";
import { Quiz } from "@/types";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userErr } = await supabase.auth.getUser();

    if (userErr) {
      console.error("Supabase getUser error:", userErr);
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      topicId,
      topicTitle,
      subject,
      grade,
      level,
      userInterests,
      numQuestions = 3,
    } = body;

    // Validation
    if (!topicId || !topicTitle || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (subject === 'math' && !grade) {
      return NextResponse.json({ error: "Missing grade for math quiz" }, { status: 400 });
    }
    if (subject === 'english' && !level) {
      return NextResponse.json({ error: "Missing level for english quiz" }, { status: 400 });
    }

    if (!Array.isArray(userInterests) || userInterests.length === 0) {
      return NextResponse.json({ error: "Missing userInterests" }, { status: 400 });
    }

    const isEnglish = subject === 'english';
    const isProgramming = subject === 'python' || subject === 'cpp';
    const languageLabel = subject === 'python' ? 'Python' : subject === 'cpp' ? 'C++' : '';

    const prompt = isEnglish
      ? `Ты профессиональный преподаватель английского языка. Создай тест для проверки знаний ученика.

**ИНФОРМАЦИЯ ОБ УЧЕНИКЕ:**
- Уровень: ${level}
- Интересы: ${userInterests.join(", ")} (используй ЛЮБОЙ из этих интересов!)

**ТЕМА ТЕСТА:**
- ${topicTitle}

**ЗАДАНИЕ:**
Создай ${numQuestions} вопроса с множественным выбором (4 варианта ответа). Тест должен быть уровня ${level}.

**ФОРМАТ ВОПРОСОВ:**
- Текст вопроса и объяснения — на русском.
- Примеры/предложения/варианты ответов — на английском.
- Используй интересы ученика в контексте (спорт/музыка/игры и т.д.), чтобы было мотивирующе.

**ТИПЫ ВОПРОСОВ (мешай):**
- грамматика (времена/артикли/предлоги)
- лексика
- понимание короткого текста
- выбор правильной формы/слова

**СОКРАТИЧЕСКАЯ ОБРАТНАЯ СВЯЗЬ:**
Для КАЖДОГО неправильного ответа напиши поле "errorFeedback":
- почему это неверно
- подсказка к правильному правилу
- 1-2 предложения
Правильный ответ НЕ должен иметь обратной связи (оставь null).

**ОБЪЯСНЕНИЕ ПРАВИЛЬНОГО ОТВЕТА:**
Для КАЖДОГО вопроса напиши поле "correctExplanation":
- почему правильный вариант верен
- короткое правило/логика
- 2-3 предложения

**КРИТИЧЕСКИЕ ТРЕБОВАНИЯ:**
- Верни ТОЛЬКО валидный JSON
- Один правильный ответ

Верни ТОЛЬКО валидный JSON с такой структурой:
{
  "topicId": "${topicId}",
  "questions": [
    {
      "id": "q1",
      "question": "Текст вопроса...",
      "correctExplanation": "...",
      "options": [
        { "id": "opt-a", "text": "...", "errorFeedback": "..." },
        { "id": "opt-b", "text": "...", "errorFeedback": null },
        { "id": "opt-c", "text": "...", "errorFeedback": "..." },
        { "id": "opt-d", "text": "...", "errorFeedback": "..." }
      ],
      "correctAnswer": "opt-b"
    }
  ]
}`
      : isProgramming
      ? `Ты профессиональный преподаватель программирования. Создай тест по ${languageLabel} для новичка.

**ИНФОРМАЦИЯ ОБ УЧЕНИКЕ:**
- Интересы: ${userInterests.join(", ")} (используй ЛЮБОЙ из этих интересов в контексте!)

**ТЕМА ТЕСТА:**
- ${topicTitle}

**ЗАДАНИЕ:**
Создай ${numQuestions} вопросов с множественным выбором (4 варианта ответа). Это НЕ запуск кода, а тест, как в школе:
- «Что выведет код?»
- «Где ошибка?»
- «Какая строка правильная?»
- «Какой тип/значение получится?»

**ФОРМАТ:**
- Вопрос и объяснения — на русском.
- Внутри вариантов ответа и в самом вопросе МОЖНО вставлять код (1–10 строк) на ${languageLabel}.
- Код вставляй обычным текстом (без Markdown). Можно использовать \n.

**СОКРАТИЧЕСКАЯ ОБРАТНАЯ СВЯЗЬ:**
Для КАЖДОГО неправильного ответа напиши "errorFeedback":
- почему неверно
- какой типичный баг/ошибка мышления
- 1–2 предложения
Правильный ответ: errorFeedback = null

**ОБЪЯСНЕНИЕ ПРАВИЛЬНОГО ОТВЕТА:**
Для КАЖДОГО вопроса напиши "correctExplanation":
- почему верно
- короткое правило/логика
- 2–3 предложения

**КРИТИЧЕСКИЕ ТРЕБОВАНИЯ:**
- Верни ТОЛЬКО валидный JSON
- РОВНО 1 правильный ответ
- 4 варианта ответа

Верни ТОЛЬКО валидный JSON:
{
  "topicId": "${topicId}",
  "questions": [
    {
      "id": "q1",
      "question": "Текст вопроса...",
      "correctExplanation": "...",
      "options": [
        { "id": "opt-a", "text": "...", "errorFeedback": "..." },
        { "id": "opt-b", "text": "...", "errorFeedback": null },
        { "id": "opt-c", "text": "...", "errorFeedback": "..." },
        { "id": "opt-d", "text": "...", "errorFeedback": "..." }
      ],
      "correctAnswer": "opt-b"
    }
  ]
}`
      : `Ты профессиональный преподаватель математики. Создай тест для проверки знаний ученика.

**ИНФОРМАЦИЯ ОБ УЧЕНИКЕ:**
- Класс: ${grade}
- Интересы: ${userInterests.join(", ")}

**ТЕМА ТЕСТА:**
- ${topicTitle}

**ЗАДАНИЕ:**
Создай ${numQuestions} вопроса с множественным выбором. Каждый вопрос должен:
- Быть на уровне ${grade} класса
- По возможности использовать РАЗНЫЕ интересы ученика для контекста (${userInterests.join(", ")})
- Варьировать интересы между вопросами для разнообразия
- Иметь 4 варианта ответа
- Иметь ТОЛЬКО ОДИН правильный ответ

**СОКРАТИЧЕСКАЯ ОБРАТНАЯ СВЯЗЬ:**
Для КАЖДОГО неправильного ответа напиши:
- Почему этот ответ НЕ правильный
- Какую ошибку делает ученик, выбирая его
- Подсказку, как найти правильный ответ
- 1-2 предложения

Правильный ответ НЕ должен иметь обратной связи (оставь null).

**ОБЪЯСНЕНИЕ ПРАВИЛЬНОГО ОТВЕТА:**
Для КАЖДОГО вопроса напиши поле "correctExplanation":
- почему правильный вариант верен
- короткое правило/логика
- 2-3 предложения

**КРИТИЧЕСКИЕ ТРЕБОВАНИЯ:**
- Верни ТОЛЬКО валидный JSON
- Один правильный ответ

Верни ТОЛЬКО валидный JSON с такой структурой:
{
  "topicId": "${topicId}",
  "questions": [
    {
      "id": "q1",
      "question": "Текст вопроса...",
      "correctExplanation": "...",
      "options": [
        { "id": "opt-a", "text": "...", "errorFeedback": "..." },
        { "id": "opt-b", "text": "...", "errorFeedback": null },
        { "id": "opt-c", "text": "...", "errorFeedback": "..." },
        { "id": "opt-d", "text": "...", "errorFeedback": "..." }
      ],
      "correctAnswer": "opt-b"
    }
  ]
}`;

    const responseText = await generateWithGemini({
      model: "gemini-2.5-flash",
      prompt,
      temperature: 0.7,
    });

    let jsonText = responseText.trim();

    // strip code fences
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\s*/, "").replace(/```$/, "").trim();
    }

    // convert undefined -> null if model outputs it
    jsonText = jsonText.replace(/"errorFeedback":\s*undefined/g, '"errorFeedback": null');
    jsonText = jsonText.replace(/"errorFeedback":\s*"undefined"/g, '"errorFeedback": null');

    let quizData: Quiz;
    try {
      quizData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response preview:", responseText.substring(0, 400));
      return NextResponse.json(
        { error: "AI returned invalid format. Please try again." },
        { status: 500 }
      );
    }

    if (!quizData.questions || quizData.questions.length === 0) {
      return NextResponse.json(
        { error: "AI generated incomplete quiz. Please try again." },
        { status: 500 }
      );
    }

    quizData.questions = quizData.questions.map((q: any) => ({
      ...q,
      topicId,
    }));

    return NextResponse.json(quizData);
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz", details: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

