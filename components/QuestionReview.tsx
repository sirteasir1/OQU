'use client';

import { QuizOption } from '@/types';

interface QuestionReviewProps {
  questionNumber: number;
  questionText: string;
  selectedOptionText: string;
  correctOptionText: string;
  isCorrect: boolean;
  feedback?: string;
  correctExplanation?: string; // Explanation for why correct answer is correct
}

export default function QuestionReview({
  questionNumber,
  questionText,
  selectedOptionText,
  correctOptionText,
  isCorrect,
  feedback,
  correctExplanation
}: QuestionReviewProps) {
  if (isCorrect) {
    // Correct answer - compact green card
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">✓</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-900">Вопрос {questionNumber}: Правильно!</p>
            <p className="text-sm text-green-700 mt-1">{questionText}</p>
          </div>
        </div>
      </div>
    );
  }

  // Wrong answer - expanded red card with detailed feedback
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">✗</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-red-900 mb-2">Вопрос {questionNumber}: Разберём</p>
          <p className="text-gray-800 mb-3 font-medium">{questionText}</p>
          
          <div className="space-y-3">
            {/* What You Chose */}
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-xs text-red-600 font-semibold uppercase mb-1">Ваш ответ</p>
              <p className="text-gray-800">{selectedOptionText}</p>
            </div>

            {/* Correct Answer */}
            <div className="bg-white rounded-lg p-3 border border-green-300">
              <p className="text-xs text-green-700 font-semibold uppercase mb-1">Правильный ответ</p>
              <p className="text-gray-800">{correctOptionText}</p>
            </div>

            {/* Correct Answer Explanation */}
            {correctExplanation && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">✨</span>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 mb-2">Объяснение решения:</p>
                    <p className="text-gray-700 leading-relaxed">{correctExplanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Socratic Feedback */}
            {feedback && (
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border border-violet-200">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤔</span>
                  <div className="flex-1">
                    <p className="font-semibold text-violet-900 mb-2">Разбор ошибки:</p>
                    <p className="text-gray-700 leading-relaxed">{feedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
