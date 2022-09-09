import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const getCorsConfig: CorsOptions = {
	origin: process.env.APP_URL,
	credentials: true,
	methods: ['GET', 'POST', 'DELETE', 'PUT']
};
