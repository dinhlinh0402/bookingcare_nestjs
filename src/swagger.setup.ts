import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


export function setUpSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('Test API')
        .setDescription('The API document to use for development')
        .setVersion('1.0')
        .addTag('bookingcare')
        .addBasicAuth()
        .build()

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}