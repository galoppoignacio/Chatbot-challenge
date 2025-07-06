import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import './config/firebase';


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['http://localhost:3000', 'https://chatbot-challenge-ten.vercel.app'] }); 
  await app.listen(process.env.port || 3001);
  console.log('Backend listo');
}

bootstrap();
