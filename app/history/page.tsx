'use client';

import { useRouter } from 'next/navigation';
import { getAttemptHistory, getAttemptStats } from '@/lib/attemptStorage';
import { Attempt } from '@/types';

export default function HistoryPage() {
  const router = useRouter();
  const attempts = getAttemptHistory();

  // Group attempts by topic
  const attemptsByTopic = attempts.reduce((acc, attempt) => {
    if (!acc[attempt.topicId]) {
      acc[attempt.topicId] = [];
    }
    acc[attempt.topicId].push(attempt);
    return acc;
  }, {} as Record<string, Attempt[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header - Mobile Responsive */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-purple-600 hover:text-purple-700 font-medium mb-4 flex items-center gap-2 text-sm md:text-base"
          >
            ← Назад к панели
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">📚 История обучения</h1>
          <p className="text-sm md:text-base text-gray-600">
            Просмотрите все ваши попытки прохождения тестов
          </p>
        </div>

        {/* Content */}
        {attempts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">История пуста</h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Пройдите несколько тестов, чтобы начать отслеживать прогресс!
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold
                         hover:bg-violet-700 transition-colors"
            >
              Перейти к панели
            </button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {Object.keys(attemptsByTopic).map(topicId => {
              const topicAttempts = attemptsByTopic[topicId];
              const stats = getAttemptStats(topicId);
              const latestAttempt = topicAttempts[0];

              return (
                <div key={topicId} className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
                  {/* Topic Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                        {latestAttempt.topicTitle}
                      </h2>
                      <p className="text-xs md:text-sm text-gray-500">
                        {topicAttempts.length} {topicAttempts.length === 1 ? 'попытка' : 'попыток'}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-2xl md:text-3xl font-bold text-violet-600">{stats.bestScore}%</div>
                      <div className="text-xs text-gray-500">Лучший результат</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 p-3 md:p-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold text-gray-800">{stats.averageScore}%</div>
                      <div className="text-xs text-gray-600">Средний</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold text-gray-800">{stats.latestScore}%</div>
                      <div className="text-xs text-gray-600">Последний</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold text-gray-800">{stats.totalAttempts}</div>
                      <div className="text-xs text-gray-600">Попыток</div>
                    </div>
                  </div>

                  {/* Attempt List */}
                  <div className="space-y-2">
                    {topicAttempts.map(attempt => (
                      <button
                        key={attempt.id}
                        onClick={() => router.push(`/history/${attempt.id}`)}
                        className="w-full p-3 md:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl
                                   transition-colors text-left flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                            ${attempt.percentage >= 80 ? 'bg-green-100 text-green-700' : 
                              attempt.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'}`}
                          >
                            {attempt.percentage}%
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm md:text-base">
                              {attempt.correctCount}/{attempt.totalQuestions} правильно
                            </p>
                            <p className="text-xs md:text-sm text-gray-500">
                              {new Date(attempt.timestamp).toLocaleDateString('ru-RU')} в{' '}
                              {new Date(attempt.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <span className="text-gray-400">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
