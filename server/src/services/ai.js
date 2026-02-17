import OpenAI from 'openai';
import { config } from '../config.js';
import { ExternalServiceError, ValidationError } from '../errors.js';

let openai = null;

function getOpenAI() {
  if (!config.openai.apiKey) {
    throw new ExternalServiceError('OpenAI', 'OPENAI_API_KEY is not set');
  }
  if (!openai) {
    openai = new OpenAI({ apiKey: config.openai.apiKey });
  }
  return openai;
}

/**
 * Converts plain text to Bionic Reading format by bolding the first few letters of each word.
 * Optionally first summarizes via LLM if text is very long.
 */
export async function simplifyToBionic(text, options = {}) {
  const { maxLength = 4000, summarizeFirst = false } = options;

  if (!text || typeof text !== 'string') {
    throw new ValidationError('Text is required for simplify endpoint');
  }

  let content = text.trim();
  if (content.length > 10000) {
    content = content.slice(0, 10000) + '…';
  }

  if (summarizeFirst && content.length > 800) {
    try {
      const client = getOpenAI();
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes text clearly and concisely for students with ADHD and dyslexia. Keep the same meaning, use short sentences, and preserve key facts. Output only the summary, no preamble.',
          },
          {
            role: 'user',
            content: `Summarize the following text in under ${maxLength} characters while keeping it clear and actionable:\n\n${content}`,
          },
        ],
        max_tokens: 1024,
      });
      const summary = completion.choices[0]?.message?.content?.trim();
      if (summary) content = summary;
    } catch (err) {
      if (err.status === 401 || err.status === 429) {
        throw new ExternalServiceError('OpenAI', err.message || 'LLM request failed');
      }
      throw err;
    }
  }

  // Bionic Reading: bold first ~40% of each word (min 1, max ~3 chars for short words)
  const bionic = content
    .split(/(\s+)/)
    .map((token) => {
      if (!/^\S+$/.test(token)) return token; // whitespace
      const len = token.length;
      const boldCount = Math.min(Math.max(1, Math.ceil(len * 0.4)), Math.ceil(len / 2));
      const bold = token.slice(0, boldCount);
      const rest = token.slice(boldCount);
      return { bold, rest };
    })
    .map((part) => (part.bold !== undefined ? `${part.bold}${part.rest}` : part))
    .join('');

  return {
    originalLength: text.length,
    bionicLength: content.length,
    bionicWords: bionic.split(/\s+/).map((word) => {
      const len = word.length;
      const boldCount = Math.min(Math.max(1, Math.ceil(len * 0.4)), Math.ceil(len / 2));
      return { bold: word.slice(0, boldCount), rest: word.slice(boldCount) };
    }),
    bionicText: bionic,
    summarized: summarizeFirst && text.length > 800,
  };
}

/**
 * Generates 5 tiny, actionable subtasks for a project title.
 */
export async function generateSubtasks(projectTitle) {
  if (!projectTitle || typeof projectTitle !== 'string') {
    throw new ValidationError('Project title is required for subtask generation');
  }

  const title = projectTitle.trim();
  if (!title) {
    throw new ValidationError('Project title cannot be empty');
  }

  try {
    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a study coach for students with ADHD and dyslexia. Given a project or assignment title, respond with exactly 5 tiny, actionable steps. Each step should be one short sentence, doable in a few minutes. Output valid JSON only, in this exact format:
{"steps": ["First step here.", "Second step here.", "Third step here.", "Fourth step here.", "Fifth step here."]}
No markdown, no explanation, only the JSON object.`,
        },
        {
          role: 'user',
          content: `Project/assignment: ${title}`,
        },
      ],
      max_tokens: 512,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '{}';
    const cleaned = raw.replace(/^```json\s*|\s*```$/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed.steps)) {
      throw new ExternalServiceError('OpenAI', 'Invalid steps format from LLM');
    }

    const steps = parsed.steps
      .slice(0, 5)
      .map((s, i) => (typeof s === 'string' ? s : String(s)));

    return { steps, projectTitle: title };
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new ExternalServiceError('OpenAI', 'Could not parse subtask response');
    }
    if (err.status === 401 || err.status === 429) {
      throw new ExternalServiceError('OpenAI', err.message || 'LLM request failed');
    }
    throw err;
  }
}
