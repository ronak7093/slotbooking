import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  // app.enableCors({
  //   origin: false,
  // });
  await app.listen(process.env.PORT);
  console.log('server is up ', process.env.PORT);
}
bootstrap();
