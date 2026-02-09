import { createClient } from '@/lib/supabase/client';

export type LessonProgressRow = {
  user_id: string;
  topic_id: string;
  completed: boolean;
  best_score: number | null;
  last_score: number | null;
  attempts: number;
  updated_at?: string;
  created_at?: string;
};

export type UpsertLessonProgressParams = {
  topicId: string;
  score: number; // 0..100
  completed?: boolean;
};

/**
 * Fetch all lesson progress rows for current user.
 * Returns [] on any error.
 */
export async function fetchMyLessonProgress(): Promise<LessonProgressRow[]> {
  try {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return [];

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('user_id, topic_id, completed, best_score, last_score, attempts, updated_at, created_at')
      .eq('user_id', user.id);

    if (error) {
      console.warn('fetchMyLessonProgress error:', error.message);
      return [];
    }

    return (data ?? []) as LessonProgressRow[];
  } catch (e) {
    console.warn('fetchMyLessonProgress failed:', e);
    return [];
  }
}

/**
 * Update / create progress row for current user.
 * Best-effort: if DB/table doesn't exist yet, it won't break the app.
 */
export async function upsertMyLessonProgress({ topicId, score, completed }: UpsertLessonProgressParams): Promise<void> {
  try {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return;

    // Read existing row to be able to increment attempts and update best_score.
    const { data: existing, error: selErr } = await supabase
      .from('lesson_progress')
      .select('attempts, best_score')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .maybeSingle();

    // If table missing or RLS blocks, just skip silently.
    if (selErr && selErr.code !== 'PGRST116') {
      // PGRST116 = no rows; ok
      // Other errors might be table missing etc.
      console.warn('upsertMyLessonProgress select error:', selErr.message);
    }

    const prevAttempts = (existing as any)?.attempts ?? 0;
    const prevBest = (existing as any)?.best_score ?? null;
    const nextBest = prevBest === null ? score : Math.max(prevBest, score);

    const payload: LessonProgressRow = {
      user_id: user.id,
      topic_id: topicId,
      completed: completed ?? true,
      last_score: score,
      best_score: nextBest,
      attempts: prevAttempts + 1,
    };

    const { error: upErr } = await supabase
      .from('lesson_progress')
      .upsert(payload, { onConflict: 'user_id,topic_id' });

    if (upErr) {
      console.warn('upsertMyLessonProgress upsert error:', upErr.message);
    }
  } catch (e) {
    console.warn('upsertMyLessonProgress failed:', e);
  }
}
