import { DocumentBuilder } from '@nestjs/swagger';

export const getSwaggerConfig = new DocumentBuilder()
	.setTitle('Video_GO Documentation')
	.setDescription('Documentation for backend endpoints of my pet-project')
	.setVersion('1.0.0')
	.addTag('API')
	.build();