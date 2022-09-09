import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from './config/swagger.config';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { getCorsConfig } from './config/cors.config';

async function bootstrap() {
	const port: number = parseInt(`${process.env.PORT}`) || 8080;

	try {
		const app = await NestFactory.create(AppModule);

		app.enableCors(getCorsConfig);

		app.use(helmet());

		app.setGlobalPrefix('api');
		//Swagger setup
		const document = SwaggerModule.createDocument(app, getSwaggerConfig);
		SwaggerModule.setup('api/docs', app, document);
		//AWS-S3
		const configService = app.get(ConfigService);
		config.update({
			accessKeyId: configService.get<string>('AWS_S3_ACCESS_KEY'),
			secretAccessKey: configService.get<string>('AWS_S3_KEY_SECRET'),
			region: configService.get<string>('AWS_REGION')
		});
		//Set global DTO payloads types transform
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true
			})
		);

		app.use(compression());

		await app.listen(port);
	} catch (e) {
		console.error(e);
	}
}

bootstrap();
