import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class OpenAIService {
  async askOpenAI(prompt: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error en OpenAI:', data);
      throw new Error(data.error?.message || 'Error desconocido en OpenAI');
    }

    return data.choices?.[0]?.message?.content || 'No se pudo generar respuesta.';
  }
}
