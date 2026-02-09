import { BadgeState } from '@/types';

interface TopicCardProps {
  title: string;
  description: string;
  badgeState: BadgeState;
  score: number | null;
  onClick: () => void;
}

export default function TopicCard({ title, description, badgeState, score, onClick }: TopicCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]
                 hover:shadow-md hover:border-violet-300 transition-all duration-200
                 flex items-center justify-between group"
    >
      <div className="text-left flex-1">
        <h3 className="text-lg font-semibold text-[rgb(var(--fg))] group-hover:text-violet-600">
          {title}
        </h3>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">{description}</p>
      </div>

      <div className="ml-6">
        {badgeState === 'not-started' && (
          <div className="px-4 py-2 bg-black/5 dark:bg-white/10 text-[rgb(var(--fg))] rounded-xl text-sm font-medium">
            Не начато
          </div>
        )}

        {badgeState === 'mastered' && score !== null && (
          <div className="px-4 py-2 bg-green-500/10 text-green-700 dark:text-green-300 rounded-xl text-sm font-semibold
                          border border-green-500/30">
            ✓ {score}%
          </div>
        )}

        {badgeState === 'needs-revision' && score !== null && (
          <div className="px-4 py-2 bg-red-500/10 text-red-700 dark:text-red-300 rounded-xl text-sm font-semibold
                          border border-red-500/30">
            ⚠ {score}% - Повторить!
          </div>
        )}
      </div>
    </button>
  );
}
