// lib/validate.ts
import { Question, BloomLevel, Difficulty } from '@/types';

const VALID_BLOOM_LEVELS: BloomLevel[] = ['recall', 'understand', 'apply', 'codeTrace', 'analyze'];
const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a single question against all rules.
 */
export function validateQuestion(q: unknown, index: number): ValidationResult {
  const errors: string[] = [];
  const prefix = `Q${index + 1}`;

  if (!q || typeof q !== 'object') {
    return { valid: false, errors: [`${prefix}: Not an object`] };
  }

  const question = q as Record<string, unknown>;

  // Required string fields
  for (const field of ['question', 'explanation', 'topic', 'concept', 'sourceConcept']) {
    if (!question[field] || typeof question[field] !== 'string' || !(question[field] as string).trim()) {
      errors.push(`${prefix}: Missing or empty field "${field}"`);
    }
  }

  // Question text length
  if (typeof question.question === 'string' && question.question.length < 10) {
    errors.push(`${prefix}: Question text too short`);
  }

  // Options: must be array of exactly 4 non-empty strings
  if (!Array.isArray(question.options)) {
    errors.push(`${prefix}: "options" must be an array`);
  } else {
    if (question.options.length !== 4) {
      errors.push(`${prefix}: Must have exactly 4 options, got ${question.options.length}`);
    }
    const opts = question.options as string[];
    opts.forEach((opt, i) => {
      if (!opt || typeof opt !== 'string' || !opt.trim()) {
        errors.push(`${prefix}: Option ${i + 1} is empty`);
      }
    });
    // Duplicate options check
    const unique = new Set(opts.map((o) => o.trim().toLowerCase()));
    if (unique.size < opts.length) {
      errors.push(`${prefix}: Duplicate options found`);
    }
  }

  // correctAnswer must exist in options
  if (typeof question.correctAnswer === 'string' && Array.isArray(question.options)) {
    const opts = question.options as string[];
    if (!opts.includes(question.correctAnswer as string)) {
      errors.push(`${prefix}: "correctAnswer" not found in options`);
    }
  } else if (!question.correctAnswer) {
    errors.push(`${prefix}: Missing "correctAnswer"`);
  }

  // Bloom level
  if (!VALID_BLOOM_LEVELS.includes(question.bloomLevel as BloomLevel)) {
    errors.push(`${prefix}: Invalid bloomLevel "${question.bloomLevel}"`);
  }

  // Difficulty
  if (!VALID_DIFFICULTIES.includes(question.difficulty as Difficulty)) {
    errors.push(`${prefix}: Invalid difficulty "${question.difficulty}"`);
  }

  // Explanation length
  if (typeof question.explanation === 'string' && question.explanation.length < 10) {
    errors.push(`${prefix}: Explanation too short`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate all questions in a batch.
 * Returns valid questions and a list of errors.
 */
export function validateQuestions(questions: unknown[]): {
  valid: Question[];
  errors: string[];
  allValid: boolean;
} {
  const valid: Question[] = [];
  const allErrors: string[] = [];
  const seenQuestions = new Set<string>();

  questions.forEach((q, i) => {
    const result = validateQuestion(q, i);
    if (result.valid) {
      const typedQ = q as Question;
      // Duplicate question check
      const key = typedQ.question.trim().toLowerCase();
      if (seenQuestions.has(key)) {
        allErrors.push(`Q${i + 1}: Duplicate question text`);
      } else {
        seenQuestions.add(key);
        valid.push({ ...typedQ, id: i + 1, type: 'multiple_choice' });
      }
    } else {
      allErrors.push(...result.errors);
    }
  });

  return {
    valid,
    errors: allErrors,
    allValid: allErrors.length === 0 && valid.length === questions.length,
  };
}
