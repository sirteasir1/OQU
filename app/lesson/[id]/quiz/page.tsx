'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QuizQuestion from '@/components/QuizQuestion';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGlobalContext } from '@/context/GlobalProvider';
import { fetchQuiz } from '@/lib/aiService'; // Now uses AI!
import { createClient } from '@/lib/supabase/client';
import { buildLoaderTheme } from '@/lib/loaderTheme';
import { getTopicById } from '@/lib/courseData';
import { Quiz } from '@/types';

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

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { userInterests } = useGlobalContext();
  const topicId = params.id as string;

  const supabase = useMemo(() => createClient(), []);
  const theme = useMemo(() => buildLoaderTheme({ topicKey: `${topicId}::quiz`, interests: userInterests }), [topicId, userInterests]);

  const topic = getTopicById(topicId);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to prevent duplicate quiz loads in React Strict Mode
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Guard: Prevent duplicate execution during Strict Mode double-mount
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        const nextUrl = `/lesson/${topicId}/quiz`;
        router.replace(`/sign-in?next=${encodeURIComponent(nextUrl)}`);
        return;
      }

      if (!userInterests.length) {
        router.replace('/?edit=1');
        return;
      }

      try {
        setIsLoading(true);
        const quizData = await fetchQuiz(topicId, userInterests);
        setQuiz(quizData);
      } catch (e: any) {
        console.error('Failed to load quiz', e);
        setError(e?.message ?? 'Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [topicId, userInterests, supabase, router]);

  const handleNext = (answerData: QuizAnswer) => {
    const updatedAnswers = [...answers, answerData];
    setAnswers(updatedAnswers);

    if (!quiz) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Finished all questions - store results in sessionStorage
      const correctCount = updatedAnswers.filter(a => a.isCorrect).length;
      
      // Store quiz results in sessionStorage (avoids HTTP 431 from long URLs)
      const storageKey = `quiz_results:${topicId}`;
      sessionStorage.setItem(storageKey, JSON.stringify({
        topicId,
        score: correctCount,
        total: quiz.questions.length,
        answers: updatedAnswers,
        timestamp: Date.now()
      }));
      
      // Navigate with clean URL (no query parameters)
      router.push(`/lesson/${topicId}/result`);
    }
  };

  if (isLoading || !quiz) {
    return (
      <LoadingSpinner
        topic={topic?.title || topicId}
        topicId={topicId}
        variant="quiz"
        interests={userInterests}
      />
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const correctSoFar = answers.filter(a => a.isCorrect).length;

  return (
    <div className="min-h-screen" style={theme.bgStyle}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-purple-600 hover:text-purple-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Выйти из теста
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Проверка знаний</h1>
            <div className="text-right">
              <p className="text-sm text-gray-600">Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}</p>
              <p className="text-sm font-semibold text-green-600">{correctSoFar} правильных ответов</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Quiz Question Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <QuizQuestion
            key={currentQuestion.id}
            questionId={currentQuestion.id}
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            correctExplanation={currentQuestion.correctExplanation}
            onNext={handleNext}
          />
        </div>

        {/* Hint */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 Не торопитесь. В конце вы увидите подробные объяснения!
          </p>
        </div>
      </div>
    </div>
  );
}
