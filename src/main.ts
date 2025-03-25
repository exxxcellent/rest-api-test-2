import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle('REST Api example')
        .setDescription('The REST API description')
        .setVersion('1.0')
        .addTag('users')
        .build();
    const documentFactory = () =>
        SwaggerModule.createDocument(app, config, {
            autoTagControllers: true,
        });
    SwaggerModule.setup('api/docs', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
