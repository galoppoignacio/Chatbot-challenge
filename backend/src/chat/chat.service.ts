import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { firestore } from '../config/firebase';

@Injectable()
export class ChatService {
  private readonly GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  private readonly GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  private async getUserMessageHistory(uid: string, limitCount = 10) {
    const messagesRef = firestore.collection('messages');
    const snapshot = await messagesRef
      .where('chatId', '==', uid)
      .orderBy('timestamp', 'desc')
      .limit(limitCount)
      .get();

    return snapshot.docs.map((doc) => doc.data()).reverse();
  }


  async askGemini(prompt: string, uid: string): Promise<string> {
    try {
      const history = await this.getUserMessageHistory(uid);

      const historyParts = history.map((msg) => ({
        role: msg.user?.uid === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      const systemPrompt = {
        role: 'user',
        parts: [
          {
            text:
              'Sos un asistente de soporte técnico. Respondé siempre en el idioma que te hagan la pregunta, sé breve y cordial.',
          },
        ],
      };

      const fullThread = [
        systemPrompt,
        ...historyParts,
        { role: 'user', parts: [{ text: prompt }] },
      ];

      const response = await axios.post(
        `${this.GEMINI_URL}?key=${this.GEMINI_API_KEY}`,
        { contents: fullThread },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const text =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ??
        'No hubo respuesta de Gemini';
      return text;
    } catch (error: any) {
      console.error('Error en Gemini:', error.response?.data || error.message);
      return 'Error al obtener respuesta de Gemini';
    }
  }
}
