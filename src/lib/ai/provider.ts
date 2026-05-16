import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type LLMModel = 'gpt-4-turbo-preview' | 'gpt-3.5-turbo';

export class AIProvider {
  static async generateJSON<T>(prompt: string, systemPrompt: string, model: LLMModel = 'gpt-4-turbo-preview'): Promise<T> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing. AI generation disabled.");
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("AI returned empty response");

    return JSON.parse(content) as T;
  }
}
