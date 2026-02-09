/**
 * Lesson and Quiz Cache Service
 * Caches AI-generated content in localStorage with preference hash
 * Auto-clears when user interests change
 */

interface CachedLesson {
  content: any;
  preferencesHash: string;
  timestamp: number;
}

interface CachedQuiz {
  content: any;
  preferencesHash: string;
  timestamp: number;
}

const LESSON_CACHE_KEY = 'oqu_lesson_cache';
const QUIZ_CACHE_KEY = 'oqu_quiz_cache';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_CACHE_ENTRIES = 50; // Limit cache size to prevent localStorage overflow

/**
 * Generate hash from user interests for cache invalidation
 */
function generatePreferencesHash(interests: string[]): string {
  return interests.sort().join('|');
}

/**
 * Get cached lesson if exists and preferences match
 */
export function getCachedLesson(topicId: string, interests: string[]): any | null {
  try {
    const cache = localStorage.getItem(LESSON_CACHE_KEY);
    if (!cache) return null;

    const allCached: Record<string, CachedLesson> = JSON.parse(cache);
    const cached = allCached[topicId];

    if (!cached) return null;

    const currentHash = generatePreferencesHash(interests);
    const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRY_MS;

    // Return cached only if preferences match and not expired
    if (cached.preferencesHash === currentHash && !isExpired) {
      console.log(`✅ Cache HIT for lesson: ${topicId}`);
      return cached.content;
    }

    console.log(`❌ Cache MISS for lesson: ${topicId} (preferences changed or expired)`);
    return null;
  } catch (e) {
    console.error('Error reading lesson cache:', e);
    return null;
  }
}

/**
 * Save lesson to cache with current preferences
 */
export function cacheLesson(topicId: string, interests: string[], content: any): void {
  try {
    const cache = localStorage.getItem(LESSON_CACHE_KEY);
    const allCached: Record<string, CachedLesson> = cache ? JSON.parse(cache) : {};

    // LRU eviction: Remove oldest entry if cache is full
    const keys = Object.keys(allCached);
    if (keys.length >= MAX_CACHE_ENTRIES) {
      const oldestKey = keys.reduce((oldest, key) => 
        allCached[key].timestamp < allCached[oldest].timestamp ? key : oldest
      );
      delete allCached[oldestKey];
      console.log(`🗑️ Evicted oldest lesson cache: ${oldestKey}`);
    }

    allCached[topicId] = {
      content,
      preferencesHash: generatePreferencesHash(interests),
      timestamp: Date.now()
    };

    localStorage.setItem(LESSON_CACHE_KEY, JSON.stringify(allCached));
    console.log(`💾 Cached lesson: ${topicId}`);
  } catch (e) {
    console.error('Error caching lesson:', e);
  }
}

/**
 * Get cached quiz if exists and preferences match
 */
export function getCachedQuiz(topicId: string, interests: string[]): any | null {
  try {
    const cache = localStorage.getItem(QUIZ_CACHE_KEY);
    if (!cache) return null;

    const allCached: Record<string, CachedQuiz> = JSON.parse(cache);
    const cached = allCached[topicId];

    if (!cached) return null;

    const currentHash = generatePreferencesHash(interests);
    const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRY_MS;

    if (cached.preferencesHash === currentHash && !isExpired) {
      console.log(`✅ Cache HIT for quiz: ${topicId}`);
      return cached.content;
    }

    console.log(`❌ Cache MISS for quiz: ${topicId} (preferences changed or expired)`);
    return null;
  } catch (e) {
    console.error('Error reading quiz cache:', e);
    return null;
  }
}

/**
 * Save quiz to cache with current preferences
 */
export function cacheQuiz(topicId: string, interests: string[], content: any): void {
  try {
    const cache = localStorage.getItem(QUIZ_CACHE_KEY);
    const allCached: Record<string, CachedQuiz> = cache ? JSON.parse(cache) : {};

    // LRU eviction: Remove oldest entry if cache is full
    const keys = Object.keys(allCached);
    if (keys.length >= MAX_CACHE_ENTRIES) {
      const oldestKey = keys.reduce((oldest, key) => 
        allCached[key].timestamp < allCached[oldest].timestamp ? key : oldest
      );
      delete allCached[oldestKey];
      console.log(`🗑️ Evicted oldest quiz cache: ${oldestKey}`);
    }

    allCached[topicId] = {
      content,
      preferencesHash: generatePreferencesHash(interests),
      timestamp: Date.now()
    };

    localStorage.setItem(QUIZ_CACHE_KEY, JSON.stringify(allCached));
    console.log(`💾 Cached quiz: ${topicId}`);
  } catch (e) {
    console.error('Error caching quiz:', e);
  }
}

/**
 * Clear all cached lessons and quizzes
 * Call this when user interests change
 */
export function clearContentCache(): void {
  try {
    localStorage.removeItem(LESSON_CACHE_KEY);
    localStorage.removeItem(QUIZ_CACHE_KEY);
    console.log('🗑️ Content cache cleared');
  } catch (e) {
    console.error('Error clearing cache:', e);
  }
}
