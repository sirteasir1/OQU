import { Interest } from '@/types';

interface InterestCategory {
  name: string;
  icon: string;
  options: { label: string; icon: string }[];
}

interface InterestSelectorProps {
  selectedInterests: string[];
  onToggle: (interest: string) => void;
  categories: InterestCategory[];
}

export default function InterestSelector({ selectedInterests, onToggle, categories }: InterestSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {categories.map((category) => (
        <div
          key={category.name}
          className="rounded-2xl p-4 border transition-all duration-200
                     bg-black/5 dark:bg-white/5
                     border-[rgb(var(--border))]
                     hover:border-violet-300 dark:hover:border-violet-500/60"
        >
          {/* Category Header */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgb(var(--border))]">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">{category.name}</h3>
          </div>

          {/* Interest Pills */}
          <div className="flex flex-wrap gap-2">
            {category.options.map((option) => (
              <button
                key={option.label}
                onClick={() => onToggle(option.label)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                  flex items-center gap-1.5 border
                  ${selectedInterests.includes(option.label)
                    ? 'bg-violet-500 text-white border-violet-500 shadow-md'
                    : 'bg-[rgb(var(--card))] text-slate-700 dark:text-slate-200 border-[rgb(var(--border))] hover:border-violet-400 hover:bg-violet-50/60 dark:hover:bg-violet-500/10'
                  }
                `}
              >
                <span className="text-sm">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
