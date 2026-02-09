/**
 * Centralized Gemini API Client
 * Supports multiple API keys with automatic failover
 */

import { GoogleGenAI } from '@google/genai';

/**
 * Parse API keys from environment variable
 * Supports single key or comma-separated list
 * 
 * @returns Array of API keys
 * 
 * @example
 * GEMINI_API_KEY=key1 → ['key1']
 * GEMINI_API_KEY=key1,key2,key3 → ['key1', 'key2', 'key3']
 */
function getApiKeys(): string[] {
  const envKey = process.env.GEMINI_API_KEY;
  if (!envKey) return [];
  
  return envKey
    .split(',')
    .map(key => key.trim())
    .filter(key => key.length > 0);
}

/**
 * Generate content with automatic failover across multiple API keys
 * 
 * If first key fails, automatically tries next key until successful.
 * Throws error only if ALL keys fail.
 * 
 * @param options - Generation options
 * @returns Generated text content
 * @throws Error if no keys configured or all keys fail
 */
export async function generateWithGemini(options: {
  model: string;
  prompt: string;
  temperature?: number;
}): Promise<string> {
  const keys = getApiKeys();
  
  if (keys.length === 0) {
    throw new Error('No API keys configured. Add GEMINI_API_KEY to .env.local');
  }
  
  let lastError: Error | null = null;
  
  // Try each key sequentially
  for (let i = 0; i < keys.length; i++) {
    try {
      console.log(`🤖 Attempting generation with API key ${i + 1}/${keys.length}`);
      
      const genAI = new GoogleGenAI({ apiKey: keys[i] });
      const response = await genAI.models.generateContent({
        model: options.model,
        contents: options.prompt,
        config: {
          responseMimeType: "application/json",
          temperature: options.temperature ?? 0.7,
        }
      });
      
      // Success!
      console.log(`✅ Generation successful with key ${i + 1}`);
      return response.text as string;
      
    } catch (error: any) {
      lastError = error;
      console.warn(`⚠️ API key ${i + 1}/${keys.length} failed:`, error.message);
      
      // Continue to next key if available
      if (i < keys.length - 1) {
        console.log(`🔄 Trying next API key...`);
      }
    }
  }
  
  // All keys exhausted
  throw new Error(
    `All ${keys.length} API key(s) failed. Last error: ${lastError?.message || 'Unknown error'}`
  );
}
