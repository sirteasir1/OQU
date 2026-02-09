'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

const IELTS_TOPIC_ID = 'en-ielts-listening';

export default function IELTSListeningPractice({ level }: { level: EnglishLevel }) {
  const { userInterests } = useGlobalContext();
  const levelLabel = useMemo(() => ENGLISH_LEVELS.find((l) => l.value === level)?.label ?? level, [level]);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ReadingSet | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [ttsMode, setTtsMode] = useState<'elevenlabs' | 'browser'>('elevenlabs');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Cleanup object URLs
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    };
  }, [audioUrl]);

  const canSubmit = useMemo(() => {
    if (!data) return false;
    return data.questions.every((q) => answers[q.id]);
  }, [data, answers]);

  const generate = async () => {
    setError(null);
    setSubmitted(false);
    setShowTranscript(false);
    setAnswers({});
    setIsSpeaking(false);
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-ielts-listening', {
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

      // Try to generate real audio via ElevenLabs (if API key is configured).
      // If unavailable, fall back to browser TTS (speechSynthesis).
      setAudioLoading(true);
      try {
        const ttsRes = await fetch('/api/ielts-listening-tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: json.passage }),
        });

        if (ttsRes.ok) {
          const blob = await ttsRes.blob();
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          setTtsMode('elevenlabs');
        } else {
          setTtsMode('browser');
        }
      } catch {
        setTtsMode('browser');
      } finally {
        setAudioLoading(false);
      }
    } catch (e: any) {
      setError(e?.message || 'Не удалось сгенерировать Listening. Проверь интернет и ключ Gemini.');
    } finally {
      setIsLoading(false);
    }
  };

  const playBrowserTTS = () => {
    if (!data) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(data.passage);
    u.rate = 1;
    u.pitch = 1;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);

    utteranceRef.current = u;
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const stopBrowserTTS = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
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
        topicTitle: 'IELTS Listening',
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
    return <LoadingSpinner topic={`IELTS Listening • ${levelLabel}`} topicId={IELTS_TOPIC_ID} variant="quiz" interests={userInterests} />;
  }

  return (
    <div className="space-y-6">
      <div className="oqu-card p-6 md:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-wider text-slate-500">ENGLISH • IELTS</div>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-50">IELTS Listening Practice</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Уровень: <span className="font-semibold">{levelLabel}</span>. Сгенерируй текст + вопросы и потренируйся как на IELTS.
            </p>
          </div>

          <button onClick={generate} className="oqu-btn-primary">
            {data ? 'Сгенерировать новый вариант' : 'Сгенерировать Listening'}
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
          {/* Audio + Transcript (hidden until finish) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="oqu-card p-6 md:p-7">
              <div className="text-xs font-bold tracking-wider text-slate-500">LISTENING</div>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-slate-50">{data.title}</h3>

              <div className="mt-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">Аудио</div>
                  <div className="text-xs text-slate-500">Транскрипт откроется после проверки.</div>
                </div>

                {audioLoading ? (
                  <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">Готовим аудио…</div>
                ) : audioUrl && ttsMode === 'elevenlabs' ? (
                  <audio className="mt-3 w-full" controls src={audioUrl} />
                ) : (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={playBrowserTTS}
                      className="oqu-btn-primary"
                      disabled={isSpeaking}
                      title="Проиграть озвучку (браузер)"
                    >
                      ▶ Play
                    </button>
                    <button
                      onClick={stopBrowserTTS}
                      className="oqu-btn-ghost"
                      disabled={!isSpeaking}
                      title="Остановить"
                    >
                      ⏹ Stop
                    </button>
                    <div className="text-xs text-slate-500">(Если ElevenLabs ключ не настроен — используем озвучку браузера)</div>
                  </div>
                )}
              </div>
            </div>

            {submitted && (
              <div className="oqu-card p-6 md:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold tracking-wider text-slate-500">TRANSCRIPT</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Открывается после завершения (как на экзамене).
                    </div>
                  </div>
                  <button onClick={() => setShowTranscript((s) => !s)} className="oqu-btn-ghost">
                    {showTranscript ? 'Скрыть' : 'Показать'}
                  </button>
                </div>

                {showTranscript && (
                  <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200">
                    {data.passage}
                  </div>
                )}
              </div>
            )}
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
                                    ? 'border-violet-500/40 bg-violet-500/10 text-slate-900 dark:text-slate-50'
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
                    (canSubmit ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed')
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