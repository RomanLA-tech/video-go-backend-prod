import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
	@ApiProperty({
		name: 'Comment text',
		type: String,
	})
	@IsString()
	readonly message: string;

	@ApiProperty({
		name: 'Video Id',
		type: Number,
	})
	@IsNumber()
	readonly videoId: number;
}
