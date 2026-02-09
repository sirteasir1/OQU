'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InterestSelector from '@/components/InterestSelector';
import { useGlobalContext } from '@/context/GlobalProvider';
import { createClient } from '@/lib/supabase/client';
import { buildLoaderTheme } from '@/lib/loaderTheme';
import LoadingCard from '@/components/LoadingCard';

// Interest categories - Russian version
const INTEREST_CATEGORIES = [
  {
    name: "Музыка",
    icon: "🎧",
    options: [
      { label: "Поп", icon: "🎤" },
      { label: "Рэп", icon: "🎧" },
      { label: "Рок", icon: "🎸" },
      { label: "EDM", icon: "🎛" },
      { label: "Джаз", icon: "🎷" },
      { label: "Инди", icon: "🎵" },
    ],
  },
  {
    name: "Спорт",
    icon: "⚽",
    options: [
      { label: "Футбол", icon: "⚽" },
      { label: "Бокс", icon: "🥊" },
      { label: "Бег", icon: "🏃" },
      { label: "Плавание", icon: "🏊" },
      { label: "Баскетбол", icon: "🏀" },
      { label: "Тренажеры", icon: "🏋" },
    ],
  },
  {
    name: "Игры",
    icon: "🎮",
    options: [
      { label: "Шутеры", icon: "🔫" },
      { label: "RPG", icon: "🗡" },
      { label: "MOBA", icon: "⚔" },
      { label: "Гонки", icon: "🏎" },
      { label: "Приключения", icon: "🧭" },
    ],
  },
  {
    name: "Фильмы",
    icon: "🎬",
    options: [
      { label: "Ужасы", icon: "👻" },
      { label: "Аниме", icon: "🍥" },
      { label: "Комедия", icon: "😂" },
      { label: "Драма", icon: "🎭" },
      { label: "Фантастика", icon: "🚀" },
    ],
  },
  {
    name: "Еда",
    icon: "🍔",
    options: [
      { label: "Пицца", icon: "🍕" },
      { label: "Суши", icon: "🍣" },
      { label: "Бургеры", icon: "🍔" },
      { label: "Десерты", icon: "🍰" },
      { label: "Азиатская кухня", icon: "🍜" },
    ],
  },
  {
    name: "Технологии",
    icon: "💻",
    options: [
      { label: "ИИ", icon: "🤖" },
      { label: "Гаджеты", icon: "📱" },
      { label: "Программирование", icon: "⌨" },
      { label: "VR/AR", icon: "🕶" },
    ],
  },
  {
    name: "Путешествия",
    icon: "✈",
    options: [
      { label: "Горы", icon: "🏔" },
      { label: "Море", icon: "🏖" },
      { label: "Города", icon: "🌆" },
      { label: "Европа", icon: "🇪🇺" },
      { label: "Азия", icon: "🌏" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('edit') === '1';

  const supabase = useMemo(() => createClient(), []);
  const { setUserInterests, userInterests } = useGlobalContext();

  const theme = useMemo(
    () => buildLoaderTheme({ topicKey: 'onboarding', interests: userInterests }),
    [userInterests]
  );

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth + load profile interests from DB
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;

      if (!u) {
        router.replace('/sign-in?next=/');
        return;
      }

      setUserId(u.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('interests')
        .eq('id', u.id)
        .maybeSingle();

      const dbInterests = Array.isArray(profile?.interests) ? profile!.interests : [];

      // If user already has interests and not editing -> go dashboard
      if (!isEdit && dbInterests.length > 0) {
        setUserInterests(dbInterests);
        router.replace('/dashboard');
        return;
      }

      // Otherwise show selector (prefill from DB or local)
      const initial = dbInterests.length ? dbInterests : userInterests;
      setSelectedInterests(initial);
      setLoading(false);
    })();
  }, [supabase, router, isEdit, setUserInterests, userInterests]);

  const toggleInterest = (interestLabel: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestLabel) ? prev.filter((l) => l !== interestLabel) : [...prev, interestLabel]
    );
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0 || !userId) return;
    setError(null);
    setSaving(true);

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({ id: userId, interests: selectedInterests }, { onConflict: 'id' });

    setSaving(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    setUserInterests(selectedInterests);
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <LoadingCard
        title="Загружаем профиль…"
        subtitle="Подтягиваем интересы и настройки"
        topicKey="onboarding"
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6" style={theme.bgStyle}>
      <div
        className="w-full max-w-4xl bg-[rgb(var(--card))]/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[rgb(var(--border))]"
        style={{ maxHeight: '90vh' }}
      >
        <div className="p-6 md:p-8 text-center border-b border-[rgb(var(--border))]">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 bg-black/5 dark:bg-white/10"
          >
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Выберите свои интересы
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
            Чем больше расскажете — тем лучше мы настроим контент (и дизайн)! ✨
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8" style={{ maxHeight: 'calc(90vh - 320px)' }}>
          <InterestSelector
            selectedInterests={selectedInterests}
            onToggle={toggleInterest}
            categories={INTEREST_CATEGORIES}
          />
        </div>

        <div className="p-6 md:p-8 border-t border-[rgb(var(--border))] bg-black/5 dark:bg-white/5">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={selectedInterests.length === 0 || saving}
            className={`
              w-full py-3.5 md:py-4 rounded-xl text-base md:text-lg font-semibold 
              transition-all duration-300
              ${selectedInterests.length > 0 && !saving
                ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-not-allowed'
              }
            `}
          >
            {saving
              ? 'Сохраняем…'
              : selectedInterests.length > 0
                ? `Продолжить (${selectedInterests.length} выбрано)`
                : 'Выберите хотя бы один интерес'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
