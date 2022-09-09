import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class Base {
	@ApiProperty() @PrimaryGeneratedColumn() id: number;

	@ApiProperty({ type: Date })
	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@ApiProperty({ type: Date })
	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
