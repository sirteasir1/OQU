/**
 * Attempt Storage Service
 * Manages quiz attempt history persistence in localStorage
 */

import { Attempt, AttemptHistory } from '@/types';

const STORAGE_KEY = 'oqu_attempt_history';

/**
 * Generate a simple UUID for attempt IDs
 */
function generateId(): string {
  return `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all attempt history, optionally filtered by topic
 */
export function getAttemptHistory(topicId?: string): Attempt[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history: AttemptHistory = JSON.parse(stored);
    
    // Convert date strings back to Date objects
    const attempts = history.attempts.map(attempt => ({
      ...attempt,
      timestamp: new Date(attempt.timestamp)
    }));

    if (topicId) {
      return attempts.filter(a => a.topicId === topicId);
    }

    return attempts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    console.error('Failed to load attempt history', error);
    return [];
  }
}

/**
 * Get a single attempt by ID
 */
export function getAttemptById(id: string): Attempt | null {
  const attempts = getAttemptHistory();
  return attempts.find(a => a.id === id) || null;
}

/**
 * Save a new quiz attempt
 */
export function saveAttempt(attempt: Omit<Attempt, 'id'>): string {
  try {
    const id = generateId();
    
    // Get existing attempts
    const existing = getAttemptHistory();
    
    // Check for duplicate: same topicId and timestamp within 1 second
    const isDuplicate = existing.some(a => 
      a.topicId === attempt.topicId && 
      Math.abs(new Date(a.timestamp).getTime() - new Date(attempt.timestamp).getTime()) < 1000
    );
    
    if (isDuplicate) {
      console.warn('⚠️ Duplicate attempt save prevented for:', attempt.topicId);
      // Return the existing attempt's ID
      const existingAttempt = existing.find(a => a.topicId === attempt.topicId);
      return existingAttempt?.id || id;
    }

    const newAttempt: Attempt = {
      id,
      ...attempt,
    };

    const updated: AttemptHistory = {
      attempts: [...existing, newAttempt]
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    console.log('✅ Attempt saved:', id);
    return id;
  } catch (error) {
    console.error('Failed to save attempt', error);
    // Handle quota exceeded errors gracefully
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      // Could implement cleanup of old attempts here
      console.warn('LocalStorage quota exceeded');
    }
    return '';
  }
}

/**
 * Delete a specific attempt
 */
export function deleteAttempt(id: string): boolean {
  try {
    const existing = getAttemptHistory();
    const filtered = existing.filter(a => a.id !== id);
    
    const updated: AttemptHistory = {
      attempts: filtered
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to delete attempt', error);
    return false;
  }
}

/**
 * Clear all attempt history
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history', error);
  }
}

/**
 * Get statistics about attempts
 */
export function getAttemptStats(topicId?: string) {
  const attempts = getAttemptHistory(topicId);
  
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      latestScore: 0
    };
  }

  const scores = attempts.map(a => a.percentage);
  const total = scores.reduce((sum, score) => sum + score, 0);

  return {
    totalAttempts: attempts.length,
    averageScore: Math.round(total / attempts.length),
    bestScore: Math.max(...scores),
    latestScore: attempts[0].percentage // Already sorted by date desc
  };
}
