import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthSuccessfulResponse } from './auth.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiResponse({
		status: 200,
		description: 'Successful login',
		type: AuthSuccessfulResponse
	})
	@ApiBody({ type: AuthDto })
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto): Promise<AuthSuccessfulResponse> {
		return this.authService.login(dto);
	}

	@ApiResponse({
		status: 200,
		description: 'Registration done successfully',
		type: AuthSuccessfulResponse
	})
	@ApiBody({ type: AuthDto })
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: AuthDto): Promise<AuthSuccessfulResponse> {
		return this.authService.register(dto);
	}
}
