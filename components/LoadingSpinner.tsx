'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import { buildLoaderTheme } from '@/lib/loaderTheme';
import { getTopicFacts } from '@/lib/topicFacts';

type Props = {
  topic: string;                 // отображаемое название
  topicId?: string;              // лучше передавать id
  variant?: 'lesson' | 'quiz';   // quiz = показываем факт-карточку
  interests?: string[];          // можно передать явно, иначе возьмём из контекста
};

export default function LoadingSpinner({
  topic,
  topicId,
  variant = 'lesson',
  interests,
}: Props) {
  const ctx = useGlobalContext();
  const userInterests = interests ?? ctx.userInterests;

  const theme = useMemo(
    () => buildLoaderTheme({ topicKey: topicId ?? topic, interests: userInterests }),
    [topicId, topic, userInterests]
  );

  const facts = useMemo(
    () => getTopicFacts({ topicId, topicTitle: topic, interests: userInterests, max: 6 }),
    [topicId, topic, userInterests]
  );

  // rotate facts while loading (mainly for quiz)
  const [factIndex, setFactIndex] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!facts.length) return;
    // reset when topic/interests change
    setFactIndex(0);
  }, [facts]);

  useEffect(() => {
    if (variant !== 'quiz' || facts.length <= 1) return;
    const t = setInterval(() => {
      setPulse(true);
      setFactIndex((i) => (i + 1) % facts.length);
      // small animation toggle
      setTimeout(() => setPulse(false), 240);
    }, 3800);
    return () => clearInterval(t);
  }, [variant, facts.length]);

  const fact = facts[factIndex] ?? facts[0];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={theme.bgStyle}
    >
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl shadow-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 backdrop-blur-xl overflow-hidden">
          {/* Top strip */}
            <div className="p-6 md:p-8 border-b border-[rgb(var(--border))]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-300">
                  PERSONALIZED MODE • {theme.signature}
                </div>
                <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                  {variant === 'quiz' ? 'Генерируем тест…' : 'Персонализируем урок…'}
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm md:text-base">
                  Подстраиваем тему <span className="font-semibold" style={theme.accentStyle}>{topic}</span> под твои интересы
                </p>
              </div>

              {/* Interest badges */}
              <div className="flex flex-wrap gap-2 justify-end">
                {theme.badges.length > 0 ? (
                  theme.badges.map((b) => (
                    <span
                      key={b.label}
                      className="px-3 py-1 rounded-full text-xs font-semibold border"
                      style={theme.accentSoftStyle}
                      title={b.label}
                    >
                      <span className="mr-1">{b.emoji}</span>{b.label}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold border text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border-[rgb(var(--border))]">
                    ✨ без интересов
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center */}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-5">
              {/* Spinner */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[rgb(var(--border))] rounded-full"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: 'rgb(var(--fg) / 0.15)', borderTopColor: 'transparent' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full" style={theme.accentSoftStyle}></div>
                </div>
              </div>

              <div className="flex-1">
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {variant === 'quiz'
                    ? 'Собираем вопросы, варианты ответов и объяснения…'
                    : 'Собираем карточки с теорией и примерами…'}
                </div>

                {/* Progress dots */}
                <div className="flex gap-2 mt-3">
                  <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ ...theme.accentSoftStyle, animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ ...theme.accentSoftStyle, animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ ...theme.accentSoftStyle, animationDelay: '300ms' }} />
                </div>
              </div>
            </div>

            {/* Fact card (main ask) */}
            {variant === 'quiz' && fact && (
              <div className={
                "mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm p-5 md:p-6 transition-all duration-300 " +
                (pulse ? "scale-[1.01]" : "")
              }>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                      {fact.title}
                    </div>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {fact.fact}
                    </p>
                    {fact.extraLine && (
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                        <span className="font-semibold">С привязкой к твоим интересам:</span> {fact.extraLine}
                      </p>
                    )}

                    <div className="mt-4">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Где используется
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {fact.usedIn.map((u) => (
                          <span
                            key={u}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 dark:bg-white/5 border border-[rgb(var(--border))] text-slate-700 dark:text-slate-200"
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom hint */}
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Чем больше интересов выбрано — тем “богаче” визуальный стиль и примеры в заданиях.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
