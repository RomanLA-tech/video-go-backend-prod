import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@ApiResponse({
		status: 200,
		description: 'Server work correctly!',
		type: String
	})
	getHello(): string {
		return this.appService.getHello();
	}
}
