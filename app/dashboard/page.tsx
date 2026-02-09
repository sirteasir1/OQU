'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

import AppShell from '@/components/AppShell';
import TopicCard from '@/components/TopicCard';
import IELTSReadingPractice from '@/components/IELTSReadingPractice';
import IELTSListeningPractice from '@/components/IELTSListeningPractice';
import FAQAccordion from '@/components/FAQAccordion';
import Skeleton from '@/components/Skeleton';
import StudyInsights from '@/components/StudyInsights';

import { useGlobalContext } from '@/context/GlobalProvider';
import { getAttemptHistory } from '@/lib/attemptStorage';
import { createClient } from '@/lib/supabase/client';
import { Grade } from '@/types';
import {
  ENGLISH_LEVELS,
  EnglishLevel,
  getEnglishTopicsByLevel,
  getMathTopicsByGrade,
  getPythonTopics,
  getCppTopics,
} from '@/lib/courseData';

const GRADES: Grade[] = [7, 8, 9, 10, 11];
type Subject = 'math' | 'english' | 'python' | 'cpp';
type EnglishTab = 'topics' | 'ielts-reading' | 'ielts-listening';

export default function DashboardPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { getBadgeState, hasInterests, userInterests, setUserInterests } = useGlobalContext();

  const [subject, setSubject] = useState<Subject>('math');
  const [englishTab, setEnglishTab] = useState<EnglishTab>('topics');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(7);
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>('pre-intermediate');

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'needs-revision' | 'mastered'>('all');
  const [lastTopicId, setLastTopicId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Auth + load profile interests
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;

      if (!u) {
        router.replace('/sign-in?next=/dashboard');
        return;
      }

      setUserEmail(u.email ?? null);

      const { data: profile } = await supabase
        .from('profiles')
        .select('interests')
        .eq('id', u.id)
        .maybeSingle();

      const dbInterests = Array.isArray(profile?.interests) ? profile!.interests : [];
      if (dbInterests.length > 0) {
        if (userInterests.length === 0 || JSON.stringify(dbInterests) !== JSON.stringify(userInterests)) {
          setUserInterests(dbInterests);
        }
      }

      setAuthReady(true);
    })();
  }, [supabase, router, setUserInterests, userInterests]);

  useEffect(() => {
    if (!authReady) return;
    if (!hasInterests) router.replace('/?edit=1');
  }, [authReady, hasInterests, router]);

  useEffect(() => {
    try {
      const latest = getAttemptHistory()[0];
      setLastTopicId(latest?.topicId ?? null);
    } catch {
      setLastTopicId(null);
    }
  }, []);

  useEffect(() => {
    if (subject !== 'english') setEnglishTab('topics');
  }, [subject]);

  const topics = useMemo(() => {
    if (subject === 'math') return getMathTopicsByGrade(selectedGrade);
    if (subject === 'english') return getEnglishTopicsByLevel(selectedLevel);
    if (subject === 'python') return getPythonTopics();
    return getCppTopics();
  }, [subject, selectedGrade, selectedLevel]);

  const stats = useMemo(() => {
    const counts = { total: topics.length, mastered: 0, needsRevision: 0, notStarted: 0 };
    for (const t of topics) {
      const b = getBadgeState(t.id);
      if (b === 'mastered') counts.mastered += 1;
      else if (b === 'needs-revision') counts.needsRevision += 1;
      else counts.notStarted += 1;
    }
    return counts;
  }, [topics, getBadgeState]);

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    return topics
      .filter((t) => {
        if (!q) return true;
        return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      })
      .filter((t) => {
        if (statusFilter === 'all') return true;
        return getBadgeState(t.id) === statusFilter;
      });
  }, [topics, query, statusFilter, getBadgeState]);

  const englishLevelLabel = ENGLISH_LEVELS.find((l) => l.value === selectedLevel)?.label ?? selectedLevel;

  // Quick progress
  const mathProgressPct = useMemo(() => {
    // simple: mastered / total across selectedGrade
    const ts = getMathTopicsByGrade(selectedGrade);
    const mastered = ts.filter((t) => getBadgeState(t.id) === 'mastered').length;
    return ts.length ? Math.round((mastered / ts.length) * 100) : 0;
  }, [selectedGrade, getBadgeState]);

  const engProgressPct = useMemo(() => {
    const ts = getEnglishTopicsByLevel(selectedLevel);
    const mastered = ts.filter((t) => getBadgeState(t.id) === 'mastered').length;
    return ts.length ? Math.round((mastered / ts.length) * 100) : 0;
  }, [selectedLevel, getBadgeState]);

  const pyProgressPct = useMemo(() => {
    const ts = getPythonTopics();
    const mastered = ts.filter((t) => getBadgeState(t.id) === 'mastered').length;
    return ts.length ? Math.round((mastered / ts.length) * 100) : 0;
  }, [getBadgeState]);

  const cppProgressPct = useMemo(() => {
    const ts = getCppTopics();
    const mastered = ts.filter((t) => getBadgeState(t.id) === 'mastered').length;
    return ts.length ? Math.round((mastered / ts.length) * 100) : 0;
  }, [getBadgeState]);

  const MotionWrap = reduce ? (({ children }: any) => <>{children}</>) : motion.div;

  const faqItems = useMemo(
    () => [
      {
        q: 'Как считается серия дней (streak)?',
        a: 'Streak увеличивается, если ты в этот день открыл хотя бы одну карточку в уроке. Если пропустил день — серия обнуляется.',
      },
      {
        q: 'Что значит “100 карточек изучено”?',
        a: 'Мы считаем уникально просмотренные карточки (по теме и номеру карточки). Повторные просмотры не накручивают счётчик.',
      },
      {
        q: 'Сколько можно генерировать в день?',
        a: 'Сейчас лимиты ещё не включены. Позже: разовый пакет — до 20 генераций/день, подписка — безлимит.',
      },
      {
        q: 'Прогресс сохраняется?',
        a: 'Да. Статус тем и история попыток сохраняются в профиле, а streak/карточки — локально в браузере (не пропадёт при перезагрузке).',
      },
      {
        q: 'Почему я не вижу темы?',
        a: 'Сначала выбери интересы. Они влияют на контент и на оформление. Если что — нажми “Профиль” и обнови интересы.',
      },
      {
        q: 'Как быстро найти нужную тему?',
        a: 'Используй поиск и фильтр: “Не начато / Повторить / Готово”. Так проще строить план на день.',
      },
      {
        q: 'Можно ли учить английский + IELTS?',
        a: 'Да, переключись на “Английский” и открой вкладки IELTS Reading или IELTS Listening.',
      },
      {
        q: 'Как начать заново?',
        a: 'Открой “Настройки” и очисти прогресс (история/локальные данные) — добавим кнопку “Reset” в одном месте позже.',
      },
    ],
    []
  );

  if (!authReady) {
    return (
      <AppShell title="Панель обучения" subtitle="Загружаем профиль…">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 oqu-card p-6 md:p-7 overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-indigo-500/15 blur-2xl oqu-float" />
            <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-violet-500/15 blur-2xl oqu-float-slow" />
            <Skeleton className="h-4 w-24" rounded="rounded-lg" />
            <Skeleton className="mt-4 h-8 w-2/3" />
            <Skeleton className="mt-3 h-4 w-5/6" />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 p-5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-3 h-4 w-5/6" />
                <Skeleton className="mt-6 h-2 w-full" rounded="rounded-full" />
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 p-5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-3 h-4 w-5/6" />
                <Skeleton className="mt-6 h-2 w-full" rounded="rounded-full" />
              </div>
            </div>
          </div>
          <div className="oqu-card p-6 md:p-7">
            <Skeleton className="h-4 w-20" rounded="rounded-lg" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-2xl bg-white/70 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 p-3">
                  <Skeleton className="h-6 w-10 mx-auto" rounded="rounded-lg" />
                  <Skeleton className="mt-2 h-3 w-12 mx-auto" rounded="rounded-lg" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-4 h-4 w-2/3" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        </div>

        <div className="mt-6 oqu-card p-5 md:p-6">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="mt-3 h-10 w-full" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full" rounded="rounded-2xl" />
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="oqu-card p-5">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="mt-3 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Панель обучения"
      subtitle={userEmail ? `Привет, ${userEmail} • интересы: ${userInterests.length}` : 'Загружаем профиль…'}
      right={
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/history')} className="oqu-btn-primary">📚 История</button>
        </div>
      }
    >
      {/* Hero cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 oqu-card p-6 md:p-7 overflow-hidden relative">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-indigo-500/15 blur-2xl oqu-float" />
          <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-violet-500/15 blur-2xl oqu-float-slow" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-black tracking-wider text-slate-500">YOUR COURSES</div>
              <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                Выбирай курс и учись быстрее
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Контент подстраивается под твои интересы — и прогресс сохраняется в профиле.
              </p>
            </div>

            {lastTopicId && (
              <button
                onClick={() => router.push(`/lesson/${lastTopicId}`)}
                className="oqu-btn bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                ▶ Продолжить
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSubject('math')}
              className={
                'rounded-2xl border p-5 text-left transition ' +
                (subject === 'math'
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 hover:bg-black/5 dark:hover:bg-white/10')
              }
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50">🧮 Математика</div>
                <div className="text-xs font-bold text-slate-500">{selectedGrade} класс</div>
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Алгебра, геометрия, задачи</div>
              <div className="mt-4">
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${mathProgressPct}%` }} />
                </div>
                <div className="mt-2 text-xs text-slate-500">Прогресс: {mathProgressPct}%</div>
              </div>
            </button>

            <button
              onClick={() => setSubject('english')}
              className={
                'rounded-2xl border p-5 text-left transition ' +
                (subject === 'english'
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 hover:bg-black/5 dark:hover:bg-white/10')
              }
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50">🇬🇧 Английский</div>
                <div className="text-xs font-bold text-slate-500">{ENGLISH_LEVELS.find((l) => l.value === selectedLevel)?.short}</div>
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Грамматика, лексика + IELTS Reading</div>
              <div className="mt-4">
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${engProgressPct}%` }} />
                </div>
                <div className="mt-2 text-xs text-slate-500">Прогресс: {engProgressPct}%</div>
              </div>
            </button>
            <button
              onClick={() => setSubject('python')}
              className={
                'rounded-2xl border p-5 text-left transition ' +
                (subject === 'python'
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 hover:bg-black/5 dark:hover:bg-white/10')
              }
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50">🐍 Python</div>
                <div className="text-xs font-bold text-slate-500">Beginner</div>
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Синтаксис, логика, практика</div>
              <div className="mt-4">
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${pyProgressPct}%` }} />
                </div>
                <div className="mt-2 text-xs text-slate-500">Прогресс: {pyProgressPct}%</div>
              </div>
            </button>

            <button
              onClick={() => setSubject('cpp')}
              className={
                'rounded-2xl border p-5 text-left transition ' +
                (subject === 'cpp'
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 hover:bg-black/5 dark:hover:bg-white/10')
              }
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50">💻 C++</div>
                <div className="text-xs font-bold text-slate-500">Beginner</div>
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Основы, ошибки, алгоритмы</div>
              <div className="mt-4">
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${cppProgressPct}%` }} />
                </div>
                <div className="mt-2 text-xs text-slate-500">Прогресс: {cppProgressPct}%</div>
              </div>
            </button>

          </div>
        </div>

        <div className="oqu-card p-6 md:p-7">
          <div className="text-xs font-black tracking-wider text-slate-500">STATS</div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/70 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 p-3">
              <div className="text-xl font-extrabold">{stats.total}</div>
              <div className="text-xs text-slate-500">темы</div>
            </div>
            <div className="rounded-2xl bg-white/70 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 p-3">
              <div className="text-xl font-extrabold text-green-700 dark:text-green-200">{stats.mastered}</div>
              <div className="text-xs text-slate-500">готово</div>
            </div>
            <div className="rounded-2xl bg-white/70 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 p-3">
              <div className="text-xl font-extrabold text-red-700 dark:text-red-200">{stats.needsRevision}</div>
              <div className="text-xs text-slate-500">повторить</div>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            {subject === 'math' ? (
              <div>
                Активный курс: <span className="font-bold">Математика</span> • {selectedGrade} класс
              </div>
            ) : subject === 'english' ? (
              <div>
                Активный курс: <span className="font-bold">Английский</span> • {englishLevelLabel}
              </div>
            ) : subject === 'python' ? (
              <div>
                Активный курс: <span className="font-bold">Python</span> • Beginner
              </div>
            ) : (
              <div>
                Активный курс: <span className="font-bold">C++</span> • Beginner
              </div>
            )}
          </div>

          <StudyInsights days={14} />
        </div>
      </div>

      {/* Selectors */}
      <div className="mt-6 oqu-card p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">Настройка курса:</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">выбери уровень/класс (если нужно)</div>
          </div>

          {subject === 'math' ? (
          <div className="flex flex-wrap gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={
                    'px-4 py-2 rounded-xl font-semibold border transition ' +
                    (selectedGrade === g
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white/70 dark:bg-slate-950/40 border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10')
                  }
                >
                  {g} кл.
                </button>
              ))}
            </div>
          ) : subject === 'english' ? (
          <div className="flex flex-wrap gap-2">
              {ENGLISH_LEVELS.map((lvl) => (
                <button
                  key={lvl.value}
                  onClick={() => setSelectedLevel(lvl.value)}
                  className={
                    'px-4 py-2 rounded-xl font-semibold border transition ' +
                    (selectedLevel === lvl.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white/70 dark:bg-slate-950/40 border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10')
                  }
                  title={lvl.label}
                >
                  {lvl.short}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Для программирования уровни не нужны — просто выбирай тему ниже.
            </div>
          )}
        </div>

        {subject === 'english' && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setEnglishTab('topics')}
              className={
                'px-4 py-2 rounded-xl font-semibold border transition ' +
                (englishTab === 'topics'
                  ? 'bg-violet-600 text-white border-violet-600 dark:bg-violet-500 dark:text-white dark:border-violet-500'
                  : 'bg-white/70 dark:bg-slate-950/40 border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10')
              }
            >
              Темы
            </button>
            <button
              onClick={() => setEnglishTab('ielts-reading')}
              className={
                'px-4 py-2 rounded-xl font-semibold border transition ' +
                (englishTab === 'ielts-reading'
                  ? 'bg-violet-600 text-white border-violet-600 dark:bg-violet-500 dark:text-white dark:border-violet-500'
                  : 'bg-white/70 dark:bg-slate-950/40 border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10')
              }
            >
              IELTS Reading
            </button>
            <button
              onClick={() => setEnglishTab('ielts-listening')}
              className={
                'px-4 py-2 rounded-xl font-semibold border transition ' +
                (englishTab === 'ielts-listening'
                  ? 'bg-violet-600 text-white border-violet-600 dark:bg-violet-500 dark:text-white dark:border-violet-500'
                  : 'bg-white/70 dark:bg-slate-950/40 border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10')
              }
            >
              IELTS Listening
            </button>
          </div>
        )}
      </div>

      {/* English IELTS tab */}
      {subject === 'english' && englishTab === 'ielts-reading' ? (
        <div className="mt-6">
          <IELTSReadingPractice level={selectedLevel} />
        </div>
      ) : subject === 'english' && englishTab === 'ielts-listening' ? (
        <div className="mt-6">
          <IELTSListeningPractice level={selectedLevel} />
        </div>
      ) : (
        <>
          {/* Search + filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 oqu-card p-4">
              <div className="text-xs font-black tracking-wider text-slate-500">SEARCH</div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по темам…"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div className="oqu-card p-4">
              <div className="text-xs font-black tracking-wider text-slate-500">FILTER</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {([
                  ['all', 'Все'],
                  ['not-started', 'Не начато'],
                  ['needs-revision', 'Повторить'],
                  ['mastered', 'Готово'],
                ] as const).map(([v, label]) => (
                  <button
                    key={v}
                    onClick={() => setStatusFilter(v)}
                    className={
                      'px-3 py-2 rounded-xl text-sm font-semibold border transition ' +
                      (statusFilter === v
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white/70 dark:bg-slate-950/40 border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10')
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topics list */}
          <div className="mt-6 space-y-3">
            {filteredTopics.length === 0 ? (
              <div className="oqu-card p-6 text-slate-600 dark:text-slate-300">Ничего не найдено 😅</div>
            ) : (
              <MotionWrap
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {filteredTopics.map((t, idx) => {
                  const badge = getBadgeState(t.id);
                  // score is derived in context: we can read it via badge state; TopicCard takes score too
                  const attempt = getAttemptHistory(t.id)[0];
                  const score = attempt?.percentage ?? null;

                  return reduce ? (
                    <TopicCard
                      key={t.id}
                      title={t.title}
                      description={t.description}
                      badgeState={badge}
                      score={score}
                      onClick={() => router.push(`/lesson/${t.id}`)}
                    />
                  ) : (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut', delay: Math.min(idx * 0.03, 0.25) }}
                    >
                      <TopicCard
                        title={t.title}
                        description={t.description}
                        badgeState={badge}
                        score={score}
                        onClick={() => router.push(`/lesson/${t.id}`)}
                      />
                    </motion.div>
                  );
                })}
              </MotionWrap>
            )}
          </div>
        </>
      )}

      <div className="mt-8">
        <FAQAccordion
          title="Вопросы и ответы"
          subtitle="Коротко о прогрессе, лимитах и том, как всё считается"
          items={faqItems}
        />
      </div>
    </AppShell>
  );
}