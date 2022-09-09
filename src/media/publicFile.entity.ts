import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Public-File')
class PublicFileEntity {
	@ApiProperty() @PrimaryGeneratedColumn() public id: number;

	@ApiProperty() @Column() public url: string;

	@ApiProperty() @Column() public key: string;
}

export default PublicFileEntity;
