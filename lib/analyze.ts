// lib/analyze.ts
import { generateJSON } from './groq';
import { MaterialAnalysis, SubjectArea, Unit, Topic } from '@/types';

interface RawAnalysis {
  subject: string;
  subjectArea: SubjectArea;
  isProgramming: boolean;
  units: Array<{ id: string; title: string; description?: string; topics: string[] }>;
  topics: Array<{ id: string; title: string; unitId?: string }>;
  concepts: string[];
}

/**
 * Analyze material text to extract subject, units, topics, and concepts.
 */
export async function analyzeMaterial(text: string): Promise<MaterialAnalysis> {
  const prompt = `You are an expert academic curriculum analyzer.

Analyze the following study material and extract its structure.

Return ONLY a JSON object with exactly this structure:
{
  "subject": "string (the main subject name, e.g. 'C Programming', 'Calculus', 'World History')",
  "subjectArea": "one of: programming | science | humanities | mathematics | other",
  "isProgramming": boolean,
  "units": [
    {
      "id": "unit-1",
      "title": "Unit name",
      "description": "A 2-3 sentence summary of what this unit covers.",
      "topics": ["topic1", "topic2", "topic3"]
    }
  ],
  "topics": [
    {
      "id": "topic-1",
      "title": "Topic name",
      "unitId": "unit-1"
    }
  ],
  "concepts": ["concept1", "concept2", "concept3", "...up to 20 key concepts"]
}

Rules:
- Identify 2–6 units (major chapters or sections)
- Identify 5–20 topics total across all units
- Identify up to 20 key concepts (specific ideas, terms, methods)
- isProgramming = true only if material is about programming/coding/software
- subjectArea must exactly match one of the enum values
- Keep topics and concepts specific to the material, not generic
- Do not invent content — only extract what is present

STUDY MATERIAL:
---
${text.slice(0, 30000)}
---`;

  const raw = await generateJSON<RawAnalysis>(prompt);

  // Normalize and validate
  const units: Unit[] = (raw.units || []).map((u, i) => ({
    id: u.id || `unit-${i + 1}`,
    title: u.title || `Unit ${i + 1}`,
    description: u.description || '',
    topics: Array.isArray(u.topics) ? u.topics : [],
  }));

  const topics: Topic[] = (raw.topics || []).map((t, i) => ({
    id: t.id || `topic-${i + 1}`,
    title: t.title || `Topic ${i + 1}`,
    unitId: t.unitId,
  }));

  // If no topics were extracted from the topics array, derive them from units
  const finalTopics =
    topics.length > 0
      ? topics
      : units.flatMap((u) =>
          u.topics.map((t, i) => ({
            id: `${u.id}-topic-${i}`,
            title: t,
            unitId: u.id,
          }))
        );

  const concepts = Array.isArray(raw.concepts) ? raw.concepts.slice(0, 20) : [];

  const validAreas: SubjectArea[] = ['programming', 'science', 'humanities', 'mathematics', 'other'];
  const subjectArea: SubjectArea = validAreas.includes(raw.subjectArea) ? raw.subjectArea : 'other';

  return {
    subject: raw.subject || 'Unknown Subject',
    subjectArea,
    isProgramming: raw.isProgramming === true || subjectArea === 'programming',
    units,
    topics: finalTopics,
    concepts,
    rawText: text,
  };
}
