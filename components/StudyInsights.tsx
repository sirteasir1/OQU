'use client';

import { useEffect, useMemo, useState } from 'react';
import { getStudyOverview, StudyOverview } from '@/lib/studyTracker';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function StudyInsights({
  days = 14,
}: {
  days?: number;
}) {
  const [data, setData] = useState<StudyOverview>(() => getStudyOverview(days));

  useEffect(() => {
    const update = () => setData(getStudyOverview(days));
    update();
    window.addEventListener('focus', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('focus', update);
      window.removeEventListener('storage', update);
    };
  }, [days]);

  const max = useMemo(() => {
    return Math.max(1, ...data.activityLast14.map((d) => d.count));
  }, [data.activityLast14]);

  const streakGoal = 7;
  const cardsGoal = 100;
  const streakProgress = clamp(data.currentStreak / streakGoal, 0, 1);
  const cardsProgress = clamp(data.totalCards / cardsGoal, 0, 1);

  return (
    <div className="mt-5 pt-5 border-t border-slate-200 dark:border-white/10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-wider text-slate-500">PROGRESS</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="text-2xl font-extrabold">🔥 {data.currentStreak}</div>
            <div className="text-xs text-slate-500">
              {data.studiedToday ? 'Сегодня уже занимался' : 'Сегодня ещё не занимался'}
              {data.bestStreak > 0 ? ` • рекорд: ${data.bestStreak}` : ''}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold">📚 {data.totalCards}</div>
          <div className="text-xs text-slate-500">карточек изучено</div>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">🏅 7 дней подряд</div>
            <div
              className={
                'px-2.5 py-1 rounded-full text-xs font-black ' +
                (data.currentStreak >= streakGoal
                  ? 'bg-green-500/15 text-green-700 dark:text-green-200'
                  : 'bg-slate-500/10 text-slate-600 dark:text-slate-300')
              }
            >
              {data.currentStreak >= streakGoal ? 'Открыто' : `${Math.min(data.currentStreak, streakGoal)}/${streakGoal}`}
            </div>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div className="h-full bg-indigo-600" style={{ width: `${Math.round(streakProgress * 100)}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">🏅 100 карточек</div>
            <div
              className={
                'px-2.5 py-1 rounded-full text-xs font-black ' +
                (data.totalCards >= cardsGoal
                  ? 'bg-green-500/15 text-green-700 dark:text-green-200'
                  : 'bg-slate-500/10 text-slate-600 dark:text-slate-300')
              }
            >
              {data.totalCards >= cardsGoal ? 'Открыто' : `${Math.min(data.totalCards, cardsGoal)}/${cardsGoal}`}
            </div>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div className="h-full bg-indigo-600" style={{ width: `${Math.round(cardsProgress * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Activity chart */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black tracking-wider text-slate-500">LAST {days} DAYS</div>
          <div className="text-xs text-slate-500">карточки / день</div>
        </div>
        <div className="mt-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 p-3">
          <div className="h-20 flex items-end gap-1">
            {data.activityLast14.map((d) => {
              const h = Math.max(2, Math.round((d.count / max) * 80));
              return (
                <div key={d.date} className="flex-1" title={`${d.date}: ${d.count}`}
                >
                  <div
                    className={
                      'w-full rounded-md transition ' +
                      (d.count > 0 ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10')
                    }
                    style={{ height: `${h}px` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-500">
            <span>{data.activityLast14[0]?.date.slice(5)}</span>
            <span>{data.activityLast14[data.activityLast14.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
