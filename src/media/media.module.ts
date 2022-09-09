import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import PublicFileEntity from './publicFile.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [TypeOrmModule.forFeature([PublicFileEntity]), ConfigModule],
	providers: [MediaService],
	exports: [MediaService],
})
export class MediaModule {}
