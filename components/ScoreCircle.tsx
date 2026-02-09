interface ScoreCircleProps {
  score: number;
  totalQuestions: number;
}

export default function ScoreCircle({ score, totalQuestions }: ScoreCircleProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Determine color based on score
  let colorClass = 'text-gray-600';
  let bgClass = 'bg-gray-100';
  let borderClass = 'border-gray-300';
  
  if (percentage >= 80) {
    colorClass = 'text-green-600';
    bgClass = 'bg-green-50';
    borderClass = 'border-green-400';
  } else if (percentage >= 50) {
    colorClass = 'text-yellow-600';
    bgClass = 'bg-yellow-50';
    borderClass = 'border-yellow-400';
  } else {
    colorClass = 'text-red-600';
    bgClass = 'bg-red-50';
    borderClass = 'border-red-400';
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className={`
        w-48 h-48 rounded-full border-8 ${borderClass} ${bgClass}
        flex flex-col items-center justify-center
        shadow-xl transition-all duration-500
      `}>
        <div className={`text-6xl font-bold ${colorClass}`}>
          {percentage}%
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {score}/{totalQuestions} правильно
        </div>
      </div>
    </div>
  );
}
