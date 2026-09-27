export const AVAILABLE_MODELS = [
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
] as const;

export type GeminiModelId = (typeof AVAILABLE_MODELS)[number];

export interface RoastResult {
  points: string[];
  modelUsed: string;
  rawResponse?: string;
}

const SYSTEM_PROMPT = `You are RoasmiAI — a smart, brutally honest, and constructive critic.
A user shares an idea.
Your task is to roast it directly, exposing what is weak, what is missing, and what to rethink.
Be direct and sharp, but constructive — not a cruel troll.
Provide exactly 3 to 4 distinct critique points.
Return ONLY a valid JSON array containing 3 or 4 strings.
Example:
["Critique 1", "Critique 2", "Critique 3", "Critique 4"]`;

export function parseRoastCritiques(rawText: string): string[] {
  if (!rawText || !rawText.trim()) {
    return ['No critique received. Please try again.'];
  }

  let clean = rawText.trim();
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  try {
    const jsonMatch = clean.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed.map((item) => String(item).trim()).filter((item) => item.length > 5);
        if (valid.length >= 2) {
          return valid.slice(0, 4);
        }
      }
    }

    const objMatch = clean.match(/\{[\s\S]*\}/);
    if (objMatch) {
      const obj = JSON.parse(objMatch[0]);
      for (const val of Object.values(obj)) {
        if (Array.isArray(val) && val.length >= 2) {
          return val.map((item) => String(item).trim()).filter(Boolean).slice(0, 4);
        }
      }
    }
  } catch {
    // Continue to fallback
  }

  const numberedSections = clean.split(/(?:^|\n)\s*(?:\d+[\.\)]|\*|\-|\u2022)\s+/);
  const numberedPoints = numberedSections
    .map((s) => s.trim().replace(/^\*\*.*?\*\*:?\s*/, ''))
    .filter((s) => s.length > 15 && !s.toLowerCase().startsWith('here is') && !s.toLowerCase().startsWith('here are'));

  if (numberedPoints.length >= 2) {
    return numberedPoints.slice(0, 4);
  }

  const paragraphs = clean
    .split(/\n\s*\n/)
    .map((p) => p.trim().replace(/^[\d\.\*\-\u2022\s]+/, ''))
    .filter((p) => p.length > 15);

  if (paragraphs.length >= 2) {
    return paragraphs.slice(0, 4);
  }

  const sentences = clean.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 20);
  if (sentences.length >= 3) {
    return sentences.slice(0, 4);
  }

  return [clean];
}

async function callGemini(model: string, apiKey: string, idea: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload: any = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Idea: "${idea}"` }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
      responseMimeType: 'application/json',
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const msg = errData?.error?.message || `Gemini API error (${response.status})`;
    const error: any = new Error(msg);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from model');
  }
  return text;
}

export async function roastMyIdea(
  idea: string,
  preferredModel?: GeminiModelId
): Promise<RoastResult> {
  const trimmed = idea.trim();
  if (!trimmed) {
    throw new Error('Please describe your idea first.');
  }

  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY in .env');
  }

  const modelsToTry: string[] = preferredModel
    ? [preferredModel, ...AVAILABLE_MODELS.filter((m) => m !== preferredModel)]
    : [...AVAILABLE_MODELS];

  let rawOutput = '';
  let successfulModel = '';
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      rawOutput = await callGemini(model, apiKey.trim(), trimmed);
      successfulModel = model;
      break;
    } catch (err: any) {
      lastError = err;
      if (err?.status === 400 || err?.status === 403) {
        throw err;
      }
    }
  }

  if (!rawOutput) {
    throw lastError || new Error('Models currently unavailable. Please retry.');
  }

  const points = parseRoastCritiques(rawOutput);

  return {
    points,
    modelUsed: successfulModel,
    rawResponse: rawOutput,
  };
}
