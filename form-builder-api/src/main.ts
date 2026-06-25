import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // src/main.ts file mein ye change karein
const app = await NestFactory.create(AppModule);

// Ye line add ya update karein
app.enableCors({
  origin: '*', // Iska matlab hai ki koi bhi frontend aapke backend ko call kar sakta hai
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});

await app.listen(process.env.PORT || 3001);
  console.log('Backend chal raha hai port 3001 par!');
}
bootstrap();