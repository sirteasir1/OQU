/**
 * Data Service - Now with AI Integration!
 * Fetches personalized content from Gemini AI with smart caching
 */

import { LessonContent, Quiz } from '@/types';
import { getCachedLesson, cacheLesson, getCachedQuiz, cacheQuiz } from './contentCache';
import { getTopicById } from './courseData';

/**
 * Fetch lesson - AI-powered with caching
 */
export async function fetchLesson(topicId: string, interests: string[]): Promise<LessonContent> {
  // 1. Check cache first
  const cached = getCachedLesson(topicId, interests);
  if (cached) {
    return cached;
  }

  // 2. Get topic info
  const topic = getTopicById(topicId);
  if (!topic) {
    throw new Error(`Topic ${topicId} not found`);
  }

  console.log(`🤖 Generating AI lesson for: ${topic.title}`);

  try {
    // 3. Call AI API
    const response = await fetch('/api/generate-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId,
        topicTitle: topic.title,
        topicDescription: topic.description,
        subject: topic.subject,
        grade: (topic.subject === 'math' ? topic.grade : undefined),
        level: (topic.subject === 'english' ? topic.level : undefined),
        userInterests: interests
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'AI generation failed');
    }

    const lessonContent = await response.json();
    
    // 4. Cache the result
    cacheLesson(topicId, interests, lessonContent);
    
    console.log(`✅ AI lesson generated and cached`);
    return lessonContent;

  } catch (error) {
    console.error('❌ AI lesson generation failed:', error);
    throw error;
  }
}

/**
 * Fetch quiz - AI-powered with caching
 */
export async function fetchQuiz(topicId: string, interests: string[]): Promise<Quiz> {
  // 1. Check cache first
  const cached = getCachedQuiz(topicId, interests);
  if (cached) {
    return cached;
  }

  // 2. Get topic info
  const topic = getTopicById(topicId);
  if (!topic) {
    throw new Error(`Topic ${topicId} not found`);
  }

  console.log(`🤖 Generating AI quiz for: ${topic.title}`);

  try {
    // 3. Call AI API
    const response = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId,
        topicTitle: topic.title,
        subject: topic.subject,
        grade: (topic.subject === 'math' ? topic.grade : undefined),
        level: (topic.subject === 'english' ? topic.level : undefined),
        userInterests: interests,
        numQuestions: 5 // Generate 5 questions for better assessment
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'AI generation failed');
    }

    const quizData = await response.json();
    
    // 4. Cache the result
    cacheQuiz(topicId, interests, quizData);
    
    console.log(`✅ AI quiz generated and cached`);
    return quizData;

  } catch (error) {
    console.error('❌ AI quiz generation failed:', error);
    throw error;
  }
}

// Export for backward compatibility
export { fetchLesson as fetchMockLesson, fetchQuiz as fetchMockQuiz };
