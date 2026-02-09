'use client';

/**
 * Global Context Provider
 * Manages user interests (multiple) and topic scores across the application
 * Persists data to localStorage for session continuity
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Interest, UserProgress, TopicScore, BadgeState } from '@/types';

interface GlobalContextType {
  userInterests: string[]; // Array of Russian interest labels
  setUserInterests: (interests: string[]) => void;
  hasInterests: boolean; // Helper to check if user has selected any interests
  getTopicScore: (topicId: string) => TopicScore | null;
  saveTopicScore: (topicId: string, score: number) => void;
  getBadgeState: (topicId: string) => BadgeState;
  resetProgress: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const STORAGE_KEY = 'oqu_user_progress';

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    interests: [],
    scores: {},
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: convert old single interest to array
        if (parsed.interest && !parsed.interests) {
          parsed.interests = [parsed.interest];
          delete parsed.interest;
        }
        setUserProgress(parsed);
      } catch (e) {
        console.error('Failed to parse saved progress', e);
      }
    }
  }, []);

  // Save to localStorage whenever progress changes (debounced for performance)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    }, 300); // Debounce: wait 300ms after last change before saving

    return () => clearTimeout(timeoutId);
  }, [userProgress]);

  const setUserInterests = (interests: string[]) => {
    setUserProgress(prev => ({ ...prev, interests }));
  };

  const getTopicScore = (topicId: string): TopicScore | null => {
    return userProgress.scores[topicId] || null;
  };

  const saveTopicScore = (topicId: string, score: number) => {
    setUserProgress(prev => {
      const existingScore = prev.scores[topicId];
      return {
        ...prev,
        scores: {
          ...prev.scores,
          [topicId]: {
            topicId,
            score,
            attempts: (existingScore?.attempts || 0) + 1,
            lastAttempt: new Date(),
          },
        },
      };
    });
  };

  /**
   * Badge Logic (Simplified)
   * - not-started: No score exists
   * - mastered: Score >= 80%
   * - needs-revision: Score < 80%
   */
  const getBadgeState = (topicId: string): BadgeState => {
    const scoreData = userProgress.scores[topicId];
    
    if (!scoreData || scoreData.score === null) {
      return 'not-started';
    }

    // Simplified: Just check if score is high enough for mastery
    return scoreData.score >= 80 ? 'mastered' : 'needs-revision';
  };

  const resetProgress = () => {
    setUserProgress({ interests: [], scores: {} });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <GlobalContext.Provider
      value={{
        userInterests: userProgress.interests,
        setUserInterests,
        hasInterests: userProgress.interests.length > 0,
        getTopicScore,
        saveTopicScore,
        getBadgeState,
        resetProgress,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

/**
 * Custom hook to access global context
 */
export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within GlobalProvider');
  }
  return context;
}
