'use client';

import { useParams, useRouter } from 'next/navigation';
import { getAttemptById } from '@/lib/attemptStorage';
import QuestionReview from '@/components/QuestionReview';
import ScoreCircle from '@/components/ScoreCircle';

export default function AttemptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;

  const attempt = getAttemptById(attemptId);

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Попытка не найдена</h2>
          <p className="text-gray-600 mb-6">
            Эта попытка теста не существует или была удалена.
          </p>
          <button
            onClick={() => router.push('/history')}
            className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold
                       hover:bg-violet-700 transition-colors"
          >
            ← Вернуться к истории
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/history')}
          className="text-purple-600 hover:text-purple-700 font-medium mb-6 flex items-center gap-2"
        >
          ← Вернуться к истории
        </button>

        {/* Attempt Header */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{attempt.topicTitle}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📅 {new Date(attempt.timestamp).toLocaleDateString()}</span>
              <span>🕐 {new Date(attempt.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Score Display */}
          <div className="flex justify-center mb-6">
            <ScoreCircle score={attempt.correctCount} totalQuestions={attempt.totalQuestions} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{attempt.percentage}%</div>
              <div className="text-xs text-gray-600">Результат</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{attempt.correctCount}</div>
              <div className="text-xs text-gray-600">Правильно</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {attempt.totalQuestions - attempt.correctCount}
              </div>
              <div className="text-xs text-gray-600">Неправильно</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Пообъектный разбор</h2>
          
          <div className="space-y-4">
            {attempt.answers.map((answer, index) => (
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

          {/* Navigation */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push('/history')}
              className="flex-1 px-6 py-4 bg-gray-600 text-white rounded-xl font-semibold
                         hover:bg-gray-700 transition-colors"
            >
              Вернуться к истории
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-6 py-4 bg-violet-600 text-white rounded-xl font-semibold
                         hover:bg-violet-700 transition-colors"
            >
              К Панели
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
