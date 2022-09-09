import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from './video.entity';
import { MediaModule } from '../media/media.module';
import { LikeEntity } from './like.entity';

@Module({
	controllers: [VideoController],
	providers: [VideoService],
	imports: [TypeOrmModule.forFeature([VideoEntity, LikeEntity]), MediaModule]
})
export class VideoModule {}
