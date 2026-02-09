'use client';

import { useMemo, useState } from 'react';
import { EnglishLevel, ENGLISH_LEVELS } from '@/lib/courseData';
import { useGlobalContext } from '@/context/GlobalProvider';
import LoadingSpinner from '@/components/LoadingSpinner';
import { saveAttempt } from '@/lib/attemptStorage';
import { upsertMyLessonProgress } from '@/lib/progress';

type ReadingOption = { id: string; text: string };
type ReadingQuestionType = 'mcq' | 'tfng' | 'gapfill';
type ReadingQuestion = {
  id: string;
  type?: ReadingQuestionType;
  question: string;
  options: ReadingOption[];
  correctAnswer: string;
  explanation: string;
};

type ReadingSet = {
  level: EnglishLevel;
  title: string;
  passage: string;
  questions: ReadingQuestion[];
};

const IELTS_TOPIC_ID = 'en-ielts-reading';

export default function IELTSReadingPractice({ level }: { level: EnglishLevel }) {
  const { userInterests } = useGlobalContext();
  const levelLabel = useMemo(() => ENGLISH_LEVELS.find((l) => l.value === level)?.label ?? level, [level]);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ReadingSet | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!data) return false;
    return data.questions.every((q) => answers[q.id]);
  }, [data, answers]);

  const generate = async () => {
    setError(null);
    setSubmitted(false);
    setAnswers({});
    setSubmitted(false);
    setAnswers({});
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-ielts-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, userInterests }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Ошибка генерации (${res.status})`);
      }

      const json = (await res.json()) as ReadingSet;
      setData(json);
    } catch (e: any) {
      setError(e?.message || 'Не удалось сгенерировать Reading. Проверь интернет и ключ Gemini.');
    } finally {
      setIsLoading(false);
    }
  };

  const submit = async () => {
    if (!data) return;
    setSubmitted(true);

    const total = data.questions.length;
    const correct = data.questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const pct = Math.round((correct / total) * 100);

    // Save to local history (optional) + to DB progress
    try {
      saveAttempt({
        topicId: IELTS_TOPIC_ID,
        topicTitle: 'IELTS Reading',
        timestamp: new Date(),
        correctCount: correct,
        totalQuestions: total,
        percentage: pct,
        answers: data.questions.map((q) => {
          const picked = answers[q.id];
          const pickedText = q.options.find((o) => o.id === picked)?.text ?? '';
          const correctText = q.options.find((o) => o.id === q.correctAnswer)?.text ?? '';
          return {
            questionId: q.id,
            questionText:
              (q.type === 'tfng' ? '[TFNG] ' : q.type === 'gapfill' ? '[GAP] ' : '[MCQ] ') + q.question,
            selectedOptionId: picked,
            selectedOptionText: pickedText,
            correctOptionId: q.correctAnswer,
            correctOptionText: correctText,
            isCorrect: picked === q.correctAnswer,
            feedback: picked === q.correctAnswer ? undefined : q.explanation,
            correctExplanation: q.explanation,
          };
        }),
      });
    } catch {
      // ignore
    }

    await upsertMyLessonProgress({ topicId: IELTS_TOPIC_ID, score: pct, completed: true });
  };

  if (isLoading) {
    return <LoadingSpinner topic={`IELTS Reading • ${levelLabel}`} topicId={IELTS_TOPIC_ID} variant="quiz" interests={userInterests} />;
  }

  return (
    <div className="space-y-6">
      <div className="oqu-card p-6 md:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-wider text-slate-500">ENGLISH • IELTS</div>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-50">IELTS Reading Practice</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Уровень: <span className="font-semibold">{levelLabel}</span>. Сгенерируй текст + вопросы и потренируйся как на IELTS.
            </p>
          </div>

          <button onClick={generate} className="oqu-btn-primary">
            {data ? 'Сгенерировать новый вариант' : 'Сгенерировать Reading'}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Passage */}
          <div className="lg:col-span-3 oqu-card p-6 md:p-7">
            <div className="text-xs font-bold tracking-wider text-slate-500">PASSAGE</div>
            <h3 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-slate-50">{data.title}</h3>
            <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200">
              {data.passage}
            </div>
          </div>

          {/* Questions */}
          <div className="lg:col-span-2 oqu-card p-6 md:p-7">
            <div className="text-xs font-bold tracking-wider text-slate-500">QUESTIONS</div>
            <div className="mt-4 space-y-5">
              {data.questions.map((q, idx) => {
                const picked = answers[q.id];
                const isCorrect = submitted && picked === q.correctAnswer;
                const isWrong = submitted && picked && picked !== q.correctAnswer;
                const type = (q.type ?? 'mcq') as ReadingQuestionType;
                const typeLabel = type === 'tfng' ? 'TFNG' : type === 'gapfill' ? 'GAP FILL' : 'MCQ';

                return (
                  <div key={q.id} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-950/30 text-slate-600 dark:text-slate-300">
                        {typeLabel}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2">
                      {q.options.map((opt) => {
                        const selected = picked === opt.id;
                        const showCorrect = submitted && opt.id === q.correctAnswer;
                        const showWrong = submitted && selected && opt.id !== q.correctAnswer;

                        const prefix =
                          type === 'tfng'
                            ? ''
                            : type === 'gapfill'
                              ? ''
                              : `${opt.id})`;

                        return (
                          <button
                            key={opt.id}
                            disabled={submitted}
                            onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.id }))}
                            className={
                              'text-left px-3 py-2 rounded-xl border text-sm font-semibold transition ' +
                              (showCorrect
                                ? 'border-green-500/40 bg-green-500/10 text-green-800 dark:text-green-200'
                                : showWrong
                                  ? 'border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-200'
                                  : selected
                                    ? 'border-indigo-500/40 bg-indigo-500/10 text-slate-900 dark:text-slate-50'
                                    : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/30 hover:bg-black/5 dark:hover:bg-white/10')
                            }
                          >
                            {prefix && <span className="mr-2">{prefix}</span>}
                            {opt.text}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && isWrong && (
                      <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-bold">Explanation:</span> {q.explanation}
                      </div>
                    )}
                    {submitted && isCorrect && (
                      <div className="mt-3 text-xs text-green-700 dark:text-green-200 font-bold">Correct ✅</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {submitted
                  ? 'Результат сохранён в профиле и истории.'
                  : 'Ответь на все вопросы, чтобы отправить.'}
              </div>

              {!submitted ? (
                <button
                  onClick={submit}
                  disabled={!canSubmit}
                  className={
                    'oqu-btn px-4 py-2.5 rounded-xl font-semibold ' +
                    (canSubmit ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed')
                  }
                >
                  Проверить
                </button>
              ) : (
                <button onClick={generate} className="oqu-btn-ghost">Ещё вариант</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}