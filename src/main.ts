import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // const corsOptions = {
  //   origin: true, 
  //   credentials: true,
  // };

  // app.enableCors(corsOptions);
  await app.listen(7000);
}
bootstrap();
