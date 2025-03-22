import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors';
import { HttpExceptionFilter } from './common/filters';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

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
