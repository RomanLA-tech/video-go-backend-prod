import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VideoDto {
	@ApiProperty() @IsString() name: string;

	@ApiProperty({ required: false }) isPublic?: boolean;

	@ApiProperty() @IsString() description: string;
}
