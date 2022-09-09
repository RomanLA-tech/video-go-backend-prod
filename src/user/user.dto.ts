import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
	@ApiProperty({
		required: false
	})
	@IsEmail()
	email?: string;

	@ApiProperty({
		required: false
	})
	password?: string;

	@ApiProperty({
		required: false
	})
	name?: string;

	@ApiProperty({
		required: false
	})
	description?: string;
}
