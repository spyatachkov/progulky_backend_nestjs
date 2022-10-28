import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function start() {
    const PORT = process.env.PORT || 80;
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Backend for PROgulky iOS app')
        .setDescription('документация для бэкенда мобильного приложения для путешествий')
        .setVersion('1.0.0')
        .addTag('VK education iOS project')
        .build()

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/srv/docs', app, document);

    await app.listen(PORT, () => console.log(`Server start on port = ${PORT}`))
}

start();