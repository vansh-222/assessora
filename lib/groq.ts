// lib/groq.ts
import Groq from 'groq-sdk';

let _client: Groq | null = null;

function getClient(): Groq {
  if (!_client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured. Please add it to .env.local');
    }
    _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _client;
}

/**
 * Generate structured JSON from a prompt with automatic retry and repair.
 */
export async function generateJSON<T>(
  prompt: string,
  retries = 3
): Promise<T> {
  const client = getClient();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'openai/gpt-oss-120b',
        temperature: attempt === 0 ? 0.3 : 0.5,
        response_format: { type: 'json_object' },
      });

      const text = completion.choices[0]?.message?.content?.trim();
      if (!text) throw new Error('No content returned from Groq');
      
      const parsed = JSON.parse(text) as T;
      return parsed;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Groq attempt ${attempt + 1} failed:`, lastError.message);

      if (attempt < retries - 1) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }

  throw new Error(`Groq generation failed after ${retries} attempts: ${lastError?.message}`);
}

/**
 * Generate plain text from a prompt.
 */
export async function generateText(prompt: string): Promise<string> {
  const client = getClient();
  const completion = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'openai/gpt-oss-120b',
  });
  return completion.choices[0]?.message?.content?.trim() || '';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
