import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateWithGemini } from '@/lib/geminiClient';
import { EnglishLevel, ENGLISH_LEVELS } from '@/lib/courseData';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const level = (body.level as EnglishLevel) ?? 'intermediate';
    const userInterests = Array.isArray(body.userInterests) ? body.userInterests : [];
    const levelLabel = ENGLISH_LEVELS.find((l) => l.value === level)?.label ?? level;

    const prompt = `You are an IELTS Reading tutor.

Create ONE IELTS-style reading passage for level: ${levelLabel}.

Requirements:
- Passage length: 280-420 words
- Topic: modern, academic-light (environment, tech, education, society, health, business)
- If possible, include a tiny hook related to ONE of these interests: ${userInterests.join(', ') || 'none'} (optional)

Now create a mixed set of questions:
1) Exactly 4 multiple-choice questions (A-D). type = "mcq".
2) Exactly 4 True/False/Not Given statements. type = "tfng".
   - Options must be: TRUE, FALSE, NOT_GIVEN (use these IDs exactly).
3) Exactly 4 gap-fill questions. type = "gapfill".
   - Each question is a sentence with a blank written as "____".
   - Provide 4 options (A-D) that can fill the blank.

Explanations MUST be in Russian (1-2 sentences) so the student understands the logic.

Return ONLY valid JSON in this structure:
{
  "level": "${level}",
  "title": "Passage title",
  "passage": "...",
  "questions": [
    {
      "id": "mcq1",
      "type": "mcq",
      "question": "...",
      "options": [
        {"id":"A","text":"..."},
        {"id":"B","text":"..."},
        {"id":"C","text":"..."},
        {"id":"D","text":"..."}
      ],
      "correctAnswer": "A",
      "explanation": "..."
    },
    {
      "id": "tfng1",
      "type": "tfng",
      "question": "Statement...",
      "options": [
        {"id":"TRUE","text":"True"},
        {"id":"FALSE","text":"False"},
        {"id":"NOT_GIVEN","text":"Not Given"}
      ],
      "correctAnswer": "NOT_GIVEN",
      "explanation": "..."
    },
    {
      "id": "gap1",
      "type": "gapfill",
      "question": "The study found that ____ can improve memory.",
      "options": [
        {"id":"A","text":"short naps"},
        {"id":"B","text":"loud music"},
        {"id":"C","text":"random ads"},
        {"id":"D","text":"heavy meals"}
      ],
      "correctAnswer": "A",
      "explanation": "..."
    }
  ]
}`;

    const text = await generateWithGemini({
      model: 'gemini-2.5-flash',
      prompt,
      temperature: 0.6,
    });

    let jsonText = (text ?? '').trim();
    if (jsonText.startsWith('```json')) jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    if (jsonText.startsWith('```')) jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');

    const data = JSON.parse(jsonText);

    // Backward compatibility: if AI returned old format (no type), assume mcq
    if (Array.isArray(data?.questions)) {
      data.questions = data.questions.map((q: any) => {
        const type = q?.type || 'mcq';
        // Ensure TFNG has standard options
        if (type === 'tfng' && (!Array.isArray(q.options) || q.options.length < 3)) {
          q.options = [
            { id: 'TRUE', text: 'True' },
            { id: 'FALSE', text: 'False' },
            { id: 'NOT_GIVEN', text: 'Not Given' },
          ];
        }
        return { ...q, type };
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('IELTS reading generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate IELTS reading', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
