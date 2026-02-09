'use client';

import { useState } from 'react';
import { QuizOption } from '@/types';

interface AnswerData {
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

interface QuizQuestionProps {
  questionId: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  correctExplanation?: string; // Explanation for why correct answer is correct
  onNext: (answerData: AnswerData) => void;
}

export default function QuizQuestion({ 
  questionId, 
  question, 
  options, 
  correctAnswer,
  correctExplanation,
  onNext 
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (optionId: string) => {
    if (selectedOption) return; // Already answered
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === correctAnswer;
    const selectedOpt = options.find(opt => opt.id === selectedOption)!;
    const correctOpt = options.find(opt => opt.id === correctAnswer)!;

    const answerData: AnswerData = {
      questionId,
      questionText: question,
      selectedOptionId: selectedOption,
      selectedOptionText: selectedOpt.text,
      correctOptionId: correctAnswer,
      correctOptionText: correctOpt.text,
      isCorrect,
      feedback: !isCorrect ? selectedOpt.errorFeedback : undefined,
      correctExplanation, // Pass correct explanation
    };

    onNext(answerData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{question}</h2>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isThisCorrect = option.id === correctAnswer;
          
          let buttonClass = 'w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ';
          
          if (!selectedOption) {
            buttonClass += 'bg-white border-gray-200 hover:border-violet-300 hover:shadow-md text-gray-800';
          } else if (isSelected) {
            // Show color feedback immediately but don't block progression
            if (isSelected === isThisCorrect) {
              buttonClass += 'bg-green-100 border-green-500 text-green-800';
            } else {
              buttonClass += 'bg-red-100 border-red-500 text-red-800';
            }
          } else {
            buttonClass += 'bg-gray-50 border-gray-200 opacity-50 text-gray-600';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={selectedOption !== null}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{option.text}</span>
                {isSelected && (
                  <span className="text-2xl">
                    {selectedOption === correctAnswer ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Button - Shows after answering */}
      {selectedOption && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-violet-600 text-white rounded-xl font-semibold
                       hover:bg-violet-700 transition-all duration-200 shadow-lg
                       hover:shadow-xl transform hover:scale-105"
          >
            Следующий вопрос →
          </button>
        </div>
      )}
    </div>
  );
}
