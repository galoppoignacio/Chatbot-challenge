import { Controller, Post, Req, Body, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { FirebaseAuthGuard } from '../auth/firebase.auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async handlePrompt(@Req() req: any, @Body() body: { prompt: string }) {
    const { prompt } = body;
    const uid = req.user?.uid;

    if (!uid) {
      console.error('No se encontró el UID del usuario en la request');
      throw new InternalServerErrorException('Usuario no autenticado');
    }

    try {
      const reply = await this.chatService.askGemini(prompt, uid);
      return { reply };
    } catch (error) {
      console.error('Error al consultar Gemini:', error?.response?.data || error.message);
      throw new InternalServerErrorException('No se pudo generar una respuesta');
    }
  }
}
