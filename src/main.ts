import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";

async function start() {
    const PORT = process.env.PORT || 80;
    console.log(process.env.PORT);
    const app = await NestFactory.create(AppModule);


    const config = new DocumentBuilder()
        .setTitle('Backend for PROgulky iOS app')
        .setDescription('документация для бэкенда мобильного приложения для путешествий')
        .setVersion('1.0.0')
        .addTag('VK education iOS project')
        .build()

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/srv/docs', app, document);


    await app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        enableDebugMessages: true, // если false - будет возвращаться Bad Request
        stopAtFirstError: true,
    })).listen(PORT, () => console.log(`Server start on port = ${PORT}`))
}

start();
