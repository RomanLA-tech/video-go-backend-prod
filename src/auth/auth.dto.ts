import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
	@ApiProperty() @IsEmail() email: string;

	@ApiProperty({ minLength: 6 })
	@MinLength(6, { message: 'Minimum 6 symbols!' })
	@IsString()
	password: string;
}
