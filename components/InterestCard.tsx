import { Interest } from '@/types';

interface InterestCardProps {
  interest: Interest;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function InterestCard({ interest, icon, isSelected, onClick }: InterestCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-8 rounded-2xl border-2 transition-all duration-300
        flex flex-col items-center justify-center gap-4
        hover:scale-105 hover:shadow-xl
        ${isSelected 
          ? 'bg-violet-500 border-violet-600 text-white shadow-lg' 
          : 'bg-[rgb(var(--card))] border-[rgb(var(--border))] text-slate-700 dark:text-slate-200 hover:border-violet-400'
        }
      `}
    >
      <div className="text-5xl">{icon}</div>
      <div className="text-xl font-semibold">{interest}</div>
      
      {isSelected && (
        <div className="absolute top-3 right-3">
          <svg 
            className="w-6 h-6 text-white" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      )}
    </button>
  );
}
