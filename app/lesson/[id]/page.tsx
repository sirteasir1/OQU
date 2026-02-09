'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { buildLoaderTheme } from '@/lib/loaderTheme';
import { useGlobalContext } from '@/context/GlobalProvider';
import { fetchMockLesson } from '@/lib/aiService';
import { LessonContent, LessonCard } from '@/types';
import { getTopicById } from '@/lib/courseData';
import { recordCardViewed } from '@/lib/studyTracker';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { userInterests } = useGlobalContext();
  const topicId = params.id as string;

  const supabase = useMemo(() => createClient(), []);
  const theme = useMemo(() => buildLoaderTheme({ topicKey: topicId, interests: userInterests }), [topicId, userInterests]);

  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const topic = getTopicById(topicId);

  useEffect(() => {
    const loadLesson = async () => {
      if (hasLoadedRef.current) return;
      hasLoadedRef.current = true;

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        const nextUrl = `/lesson/${topicId}`;
        router.replace(`/sign-in?next=${encodeURIComponent(nextUrl)}`);
        return;
      }

      if (userInterests.length === 0) {
        router.replace('/?edit=1');
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const content = await fetchMockLesson(topicId, userInterests);
        setLessonContent(content);
      } catch (err: any) {
        console.error('Failed to load lesson:', err);
        setError(err.message || 'Failed to generate lesson. Please check your internet connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [topicId, userInterests, router]);

  const handleNext = () => {
    if (!lessonContent) return;

    if (currentCardIndex < lessonContent.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      router.push(`/lesson/${topicId}/quiz`);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Track card views for streak / badges.
  useEffect(() => {
    if (!lessonContent) return;
    recordCardViewed(topicId, currentCardIndex);
  }, [lessonContent, topicId, currentCardIndex]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={theme.bgStyle}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Ошибка генерации</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition"
            >
              Попробовать снова
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Вернуться к панели
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !lessonContent) {
    return <LoadingSpinner topic={topic?.title || topicId} topicId={topicId} variant="lesson" interests={userInterests} />;
  }

  const currentCard = lessonContent.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / lessonContent.cards.length) * 100;
  const isLastCard = currentCardIndex === lessonContent.cards.length - 1;

  return (
    <div className="min-h-screen" style={theme.bgStyle}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-violet-600 hover:text-violet-700 font-medium mb-4 flex items-center gap-2"
          >
            ← К Панели
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{topic?.title}</h1>
          
          <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-violet-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Карточка {currentCardIndex + 1} из {lessonContent.cards.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <span className={`
              inline-block px-4 py-2 rounded-full text-sm font-semibold
              ${currentCard.type === 'metaphor' ? 'bg-purple-100 text-purple-700' : ''}
              ${currentCard.type === 'theory' ? 'bg-violet-100 text-violet-700' : ''}
              ${currentCard.type === 'example' ? 'bg-green-100 text-green-700' : ''}
            `}>
              {currentCard.type === 'metaphor' && '🎯 Метафора'}
              {currentCard.type === 'theory' && '📚 Теория'}
              {currentCard.type === 'example' && '💡 Пример'}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {currentCard.title}
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed">
            {currentCard.content}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-200
              ${currentCardIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
              }
            `}
          >
            ← Назад
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3 bg-violet-600 text-white rounded-xl font-semibold
                       hover:bg-violet-700 transition-all duration-200 hover:shadow-lg"
          >
            {isLastCard ? 'Пройти Тест →' : 'Далее →'}
          </button>
        </div>
      </div>
    </div>
  );
}
