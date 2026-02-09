export type StudyTrackerState = {
  // Unique cards the user has ever viewed (topicId:index)
  viewedCardKeys: string[];
  // Per-day unique card views (YYYY-MM-DD -> array of keys)
  dailyViewed: Record<string, string[]>;
};

export type StudyDay = {
  date: string; // YYYY-MM-DD
  count: number;
};

export type StudyOverview = {
  totalCards: number;
  currentStreak: number;
  bestStreak: number;
  studiedToday: boolean;
  activityLast14: StudyDay[];
};

const STORAGE_KEY = 'oqu_study_v1';

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function formatLocalDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function safeParse(json: string | null): StudyTrackerState | null {
  if (!json) return null;
  try {
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== 'object') return null;
    const viewedCardKeys = Array.isArray(obj.viewedCardKeys) ? obj.viewedCardKeys : [];
    const dailyViewed = obj.dailyViewed && typeof obj.dailyViewed === 'object' ? obj.dailyViewed : {};
    return { viewedCardKeys, dailyViewed };
  } catch {
    return null;
  }
}

export function loadStudyState(): StudyTrackerState {
  if (typeof window === 'undefined') return { viewedCardKeys: [], dailyViewed: {} };
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  return parsed ?? { viewedCardKeys: [], dailyViewed: {} };
}

export function saveStudyState(state: StudyTrackerState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function recordCardViewed(topicId: string, cardIndex: number) {
  if (typeof window === 'undefined') return;
  const key = `${topicId}:${cardIndex}`;
  const today = formatLocalDate(new Date());

  const state = loadStudyState();
  const viewedSet = new Set(state.viewedCardKeys);
  const dayKeys = Array.isArray(state.dailyViewed[today]) ? state.dailyViewed[today] : [];
  const daySet = new Set(dayKeys);

  // Add to global unique
  if (!viewedSet.has(key)) {
    viewedSet.add(key);
  }

  // Add to per-day unique
  if (!daySet.has(key)) {
    daySet.add(key);
  }

  const next: StudyTrackerState = {
    viewedCardKeys: Array.from(viewedSet),
    dailyViewed: {
      ...state.dailyViewed,
      [today]: Array.from(daySet),
    },
  };

  saveStudyState(next);
}

function hasDay(state: StudyTrackerState, date: string) {
  const arr = state.dailyViewed[date];
  return Array.isArray(arr) && arr.length > 0;
}

function getConsecutiveStreak(state: StudyTrackerState, anchorDate: string) {
  // Walk backwards from anchorDate
  let streak = 0;
  const [y, m, d] = anchorDate.split('-').map((x) => parseInt(x, 10));
  if (!y || !m || !d) return 0;
  const cur = new Date(y, m - 1, d);
  while (true) {
    const key = formatLocalDate(cur);
    if (!hasDay(state, key)) break;
    streak += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

function computeBestStreak(state: StudyTrackerState) {
  const dates = Object.keys(state.dailyViewed)
    .filter((d) => hasDay(state, d))
    .sort();
  if (dates.length === 0) return 0;

  let best = 1;
  let cur = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = dates[i - 1];
    const now = dates[i];
    const [py, pm, pd] = prev.split('-').map((x) => parseInt(x, 10));
    const prevDate = new Date(py, pm - 1, pd);
    prevDate.setDate(prevDate.getDate() + 1);
    const expected = formatLocalDate(prevDate);
    if (now === expected) {
      cur += 1;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
}

export function getStudyOverview(days: number = 14): StudyOverview {
  const state = loadStudyState();
  const today = formatLocalDate(new Date());
  const studiedToday = hasDay(state, today);

  // If no activity today, streak is based on yesterday (common UX)
  const anchor = studiedToday
    ? today
    : (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return formatLocalDate(d);
      })();

  const currentStreak = getConsecutiveStreak(state, anchor);
  const bestStreak = computeBestStreak(state);

  const activityLast14: StudyDay[] = [];
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = formatLocalDate(d);
    const count = Array.isArray(state.dailyViewed[key]) ? state.dailyViewed[key].length : 0;
    activityLast14.push({ date: key, count });
  }

  return {
    totalCards: state.viewedCardKeys.length,
    currentStreak,
    bestStreak,
    studiedToday,
    activityLast14,
  };
}
