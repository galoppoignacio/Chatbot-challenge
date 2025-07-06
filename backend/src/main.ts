import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import './config/firebase';


async function bootstrap() {
  

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000' }); //TODO Agregar vercel para cuando se despliegue
  await app.listen(3001);
  console.log('Backend escuchando en http://localhost:3001');
}

bootstrap();
