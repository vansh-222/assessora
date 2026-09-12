// lib/generate.ts
import { generateJSON } from './groq';
import { validateQuestions } from './validate';
import { Question, MaterialAnalysis, AssessmentConfig, BloomLevel, BloomDistribution } from '@/types';
import { BLOOM_LABELS } from './bloom';

interface RawQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  concept: string;
  bloomLevel: BloomLevel;
  difficulty: string;
  sourceConcept: string;
}

/**
 * Generate questions from material analysis + config using Gemini.
 * Validates and repairs until we have the required count.
 */
export async function generateQuestions(
  analysis: MaterialAnalysis,
  config: AssessmentConfig
): Promise<Question[]> {
  const { questionCount, difficulty, bloomDistribution, bloomLevels } = config;

  // Build the question list with Bloom level assignments
  const questionAssignments = buildAssignments(bloomDistribution, bloomLevels);

  const topicsStr = analysis.topics.map((t) => t.title).join(', ');
  const conceptsStr = analysis.concepts.slice(0, 15).join(', ');

  const bloomSpec = questionAssignments
    .map((b, i) => `  Question ${i + 1}: bloomLevel = "${b}"`)
    .join('\n');

  const codeTraceNote = analysis.isProgramming
    ? ''
    : 'Note: Do NOT generate codeTrace questions — this is not a programming subject.';

  const prompt = `You are an expert academic assessment designer trained in Bloom's Taxonomy.

Generate exactly ${questionCount} multiple-choice questions based on the provided study material.

SUBJECT: ${analysis.subject}
TOPICS COVERED: ${topicsStr}
KEY CONCEPTS: ${conceptsStr}
OVERALL DIFFICULTY: ${difficulty}
${codeTraceNote}

BLOOM'S TAXONOMY ASSIGNMENT (follow exactly):
${bloomSpec}

STUDY MATERIAL (excerpt):
---
${analysis.rawText.slice(0, 20000)}
---

Return ONLY a JSON array of exactly ${questionCount} question objects. Each object must follow this exact structure:
{
  "question": "Clear, specific question text based on the material",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": "Exact text matching one of the options",
  "explanation": "Detailed explanation of why the answer is correct, referencing the material",
  "topic": "Specific topic from the material this question tests",
  "concept": "The specific concept being tested",
  "bloomLevel": "One of: recall | understand | apply | codeTrace | analyze",
  "difficulty": "${difficulty}",
  "sourceConcept": "The exact term/concept from the source material"
}

CRITICAL RULES:
1. Each question must be grounded in the provided material — do NOT make up content
2. correctAnswer must be the exact text of one of the 4 options
3. All 4 options must be distinct and plausible (no obviously wrong options)
4. bloomLevel for each question must match the assignment above EXACTLY
5. Explanations must be substantive (minimum 2 sentences)
6. For ${difficulty} difficulty: ${difficultyGuidance(difficulty)}
7. Questions must test different topics/concepts — no repetition
8. For codeTrace questions: provide actual code in the question, with execution output as options

Return ONLY the JSON array. No markdown fences. No extra text.`;

  let allQuestions: Question[] = [];
  let attempts = 0;

  while (allQuestions.length < questionCount && attempts < 3) {
    attempts++;
    try {
      const raw = await generateJSON<RawQuestion[]>(prompt);
      const { valid } = validateQuestions(Array.isArray(raw) ? raw : []);
      allQuestions = valid;
    } catch (err) {
      console.error(`Generation attempt ${attempts} failed:`, err);
    }
  }

  if (allQuestions.length < questionCount) {
    throw new Error(
      `Could not generate ${questionCount} valid questions after ${attempts} attempts. Got ${allQuestions.length}.`
    );
  }

  return allQuestions.slice(0, questionCount);
}

function buildAssignments(dist: BloomDistribution, levels: BloomLevel[]): BloomLevel[] {
  const assignments: BloomLevel[] = [];
  for (const level of levels) {
    const count = dist[level] ?? 0;
    for (let i = 0; i < count; i++) {
      assignments.push(level);
    }
  }
  return assignments;
}

function difficultyGuidance(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'Questions should test basic recognition and straightforward understanding. Avoid tricky wording.';
    case 'medium':
      return 'Questions should require some analysis and application of knowledge. Include some nuanced distinctions.';
    case 'hard':
      return 'Questions should require deep understanding, complex reasoning, or subtle distinctions. Distractors should be challenging.';
    default:
      return 'Questions should be appropriately challenging for the subject level.';
  }
}
