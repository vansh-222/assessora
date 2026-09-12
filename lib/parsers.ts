// lib/parsers.ts
import { pct } from './utils';

export interface ExtractionResult {
  text: string;
  charCount: number;
  wordCount: number;
  method: 'pdf' | 'text' | 'markdown' | 'paste';
}

const MAX_FILE_SIZE_MB = 10;
const MAX_CHARS = 60000; // safe token budget for Gemini

/**
 * Extract text from uploaded file or pasted content.
 */
export async function extractText(
  input: File | string,
  method: 'pdf' | 'text' | 'markdown' | 'paste' = 'paste'
): Promise<ExtractionResult> {
  let raw = '';

  if (typeof input === 'string') {
    raw = input;
  } else {
    const file = input;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
    }

    if (file.name.endsWith('.pdf')) {
      // Server-side only: dynamic import to avoid bundler issues
      const pdfParse = (await import('pdf-parse')).default;
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await pdfParse(buffer);
      raw = result.text;
      method = 'pdf';
    } else if (file.name.endsWith('.md')) {
      raw = await file.text();
      method = 'markdown';
    } else {
      // .txt or unknown
      raw = await file.text();
      method = 'text';
    }
  }

  const cleaned = cleanText(raw);

  if (cleaned.trim().length < 50) {
    throw new Error('Extracted content is too short or empty. Please check your file.');
  }

  // Truncate if too long, keeping the most meaningful content
  const truncated = cleaned.length > MAX_CHARS ? cleaned.slice(0, MAX_CHARS) : cleaned;

  return {
    text: truncated,
    charCount: truncated.length,
    wordCount: truncated.split(/\s+/).filter(Boolean).length,
    method,
  };
}

/**
 * Clean extracted text while preserving academic content.
 */
export function cleanText(raw: string): string {
  return raw
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive blank lines (keep max 2)
    .replace(/\n{3,}/g, '\n\n')
    // Remove PDF artifacts: page numbers like "1", "- 2 -"
    .replace(/^\s*-?\s*\d+\s*-?\s*$/gm, '')
    // Remove common header/footer patterns
    .replace(/^\s*(page|pg\.?)\s*\d+\s*$/gim, '')
    // Remove URLs (but keep domain names in context)
    .replace(/https?:\/\/\S+/g, '')
    // Remove repeated special characters (e.g., ----------)
    .replace(/[-=*_]{4,}/g, '')
    // Normalize multiple spaces
    .replace(/ {2,}/g, ' ')
    // Remove null bytes
    .replace(/\0/g, '')
    .trim();
}

/**
 * Chunk long text into smaller pieces for sequential analysis.
 * Returns up to 3 chunks, prioritizing beginning and end.
 */
export function chunkText(text: string, maxChunkSize = 15000): string[] {
  if (text.length <= maxChunkSize) return [text];

  const chunks: string[] = [];
  // Beginning: most likely to have syllabus/overview
  chunks.push(text.slice(0, maxChunkSize));

  // Middle: additional content
  const mid = Math.floor(text.length / 2);
  const midChunk = text.slice(
    Math.max(0, mid - maxChunkSize / 2),
    Math.min(text.length, mid + maxChunkSize / 2)
  );
  if (midChunk.length > 1000) chunks.push(midChunk);

  // End: summary/conclusions
  if (text.length > maxChunkSize * 2) {
    const endChunk = text.slice(-Math.min(maxChunkSize, 10000));
    if (endChunk.length > 1000) chunks.push(endChunk);
  }

  return chunks;
}
