'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScoreCircle from '@/components/ScoreCircle';
import QuestionReview from '@/components/QuestionReview';
import { useGlobalContext } from '@/context/GlobalProvider';
import { buildLoaderTheme } from '@/lib/loaderTheme';
import { getTopicById } from '@/lib/courseData';
import { saveAttempt } from '@/lib/attemptStorage';
import { upsertMyLessonProgress } from '@/lib/progress';

interface QuizAnswer {
  questionId: string;
  questionText: string;
  selectedOptionId: string;
  selectedOptionText: string;
  correctOptionId: string;
  correctOptionText: string;
  isCorrect: boolean;
  feedback?: string;
  correctExplanation?: string; // Explanation for why correct answer is correct
}

interface QuizResults {
  topicId: string;
  score: number;
  total: number;
  answers: QuizAnswer[];
  timestamp: number;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const { saveTopicScore, userInterests } = useGlobalContext();
  
  const topicId = params.id as string;

  const theme = useMemo(() => buildLoaderTheme({ topicKey: `${topicId}::result`, interests: userInterests }), [topicId, userInterests]);
  
  // Read quiz results from sessionStorage
  const [quizData, setQuizData] = useState<QuizResults | null>(null);
  
  useEffect(() => {
    const storageKey = `quiz_results:${topicId}`;
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      try {
        const data: QuizResults = JSON.parse(stored);
        setQuizData(data);
      } catch (e) {
        console.error('Failed to parse quiz results', e);
      }
    }
  }, []);
  
  const score = quizData?.score || 0;
  const total = quizData?.total || 1;
  const percentage = Math.round((score / total) * 100);
  const answers = quizData?.answers || [];

  const topic = getTopicById(topicId);

  // Ref to prevent duplicate saves in React Strict Mode
  const hasSavedRef = useRef(false);

  // Save score and attempt on mount
  useEffect(() => {
    // Guard: Prevent duplicate execution during Strict Mode double-mount
    if (hasSavedRef.current || !quizData) return;
    hasSavedRef.current = true;

    saveTopicScore(topicId, percentage);
    
    // Save full attempt to history if we have answers
    if (answers.length > 0 && topic) {
      saveAttempt({
        topicId,
        topicTitle: topic.title,
        timestamp: new Date(),
        correctCount: score,
        totalQuestions: total,
        percentage,
        answers
      });

      // Persist progress in Supabase (best-effort)
      upsertMyLessonProgress({
        topicId,
        score: percentage,
        // consider a lesson “completed” once the student finishes a quiz
        completed: true,
      });
    }
  }, [quizData]); // Depend on quizData instead of empty array

  const getMessage = () => {
    if (percentage >= 80) {
      return {
        emoji: '🎉',
        title: 'Мастерство Достигнуто!',
        message: 'Вы продемонстрировали отличное понимание этой темы. Так держать!',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      };
    } else if (percentage >= 50) {
      return {
        emoji: '👍',
        title: 'Хороший Прогресс!',
        message: 'Вы на правильном пути. Повторите урок и попробуйте снова, чтобы закрепить понимание.',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      };
    } else {
      return {
        emoji: '📚',
        title: 'Требуется Повторение',
        message: 'Ваши знания по этой теме шаткие. Мы отметили это для повторения. Пожалуйста, внимательно повторите урок и попробуйте снова.',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      };
    }
  };

  const resultData = getMessage();

  return (
    <div className="min-h-screen" style={theme.bgStyle}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-10 mb-8">
          {/* Topic Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {topic?.title || 'Quiz Complete'}
            </h1>
            <p className="text-gray-600 mt-2">Вот ваши результаты</p>
          </div>

          {/* Score Display */}
          <div className="flex justify-center mb-8">
            <ScoreCircle score={score} totalQuestions={total} />
          </div>

          {/* Result Message */}
          <div className={`${resultData.bgColor} rounded-xl p-6 mb-8`}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{resultData.emoji}</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${resultData.color} mb-2`}>
                  {resultData.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {resultData.message}
                </p>
              </div>
            </div>
          </div>

          {/* Revision Warning (if score < 50%) */}
          {percentage < 50 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-xl">!</span>
                </div>
                <div>
                  <p className="font-semibold text-red-800">
                    Эта тема отмечена для повторения.
                  </p>
                  <p className="text-sm text-red-700">
                    Вы увидите напоминание на панели управления.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                try { sessionStorage.removeItem(`quiz_results:${topicId}`); } catch {}
                router.push('/dashboard');
              }}
              className="flex-1 px-6 py-4 bg-gray-600 text-white rounded-xl font-semibold
                         hover:bg-gray-700 transition-all duration-200"
            >
              К Панели
            </button>
            
            <button
              onClick={() => router.push(`/lesson/${topicId}`)}
              className="flex-1 px-6 py-4 bg-violet-600 text-white rounded-xl font-semibold
                         hover:bg-violet-700 transition-all duration-200"
            >
              Повторить Урок
            </button>
          </div>
        </div>

        {/* Detailed Analysis Section */}
        {answers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Подробный Анализ</h2>
              <p className="text-gray-600">
                Давайте рассмотрим каждый вопрос, чтобы лучше понять вашу успеваемость.
              </p>
            </div>

            {/* Question Reviews */}
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <QuestionReview
                  key={answer.questionId}
                  questionNumber={index + 1}
                  questionText={answer.questionText}
                  selectedOptionText={answer.selectedOptionText}
                  correctOptionText={answer.correctOptionText}
                  isCorrect={answer.isCorrect}
                  feedback={answer.feedback}
                  correctExplanation={answer.correctExplanation}
                />
              ))}
            </div>

            {/* Key Insights */}
            {answers.some(a => !a.isCorrect) && (
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💡</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-purple-900 mb-2">Совет по Обучению</h3>
                    <p className="text-gray-700">
                      Просмотрите объяснения выше для вопросов, которые вы пропустили. Понимание <em>почему</em> 
                      ответ неверен так же важно, как знание правильного ответа. 
                      Попробуйте решить похожие задачи, используя то же рассуждение!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
