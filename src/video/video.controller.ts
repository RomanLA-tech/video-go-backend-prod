import {
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpCode,
	Param,
	ParseFilePipe,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoDto } from './video.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VideoEntity } from './video.entity';
import {
	VALID_IMAGES_TYPES,
	VALID_VIDEO_TYPES
} from '../utils/regex-and-constants';
import { SharpPipe } from '../media/pipes/sharp.pipe';
import { ParseIdToIntPipe } from '../utils/pipes/parse-id-to-int.pipe';
import PublicFileEntity from '../media/publicFile.entity';
import { IsBoolean } from 'class-validator';

@ApiTags('Videos')
@Controller('video')
export class VideoController {
	constructor(private readonly videoService: VideoService) {}

	@Get()
	@ApiResponse({
		status: 200,
		description: 'Get videos by query | all',
		type: [VideoEntity]
	})
	async getAll(
		@Query('searchTerm' || '') searchTerm?: string
	): Promise<VideoEntity[]> {
		return this.videoService.getAllVideos(searchTerm);
	}

	@Get('most-popular')
	@ApiResponse({
		status: 200,
		description: 'Get most popular videos',
		type: [VideoEntity]
	})
	async getMostPopularByView(): Promise<VideoEntity[]> {
		return this.videoService.getMostPopularByView();
	}

	@Get('get-private/:videoId')
	@ApiResponse({
		status: 200,
		description: 'Get private video',
		type: VideoEntity
	})
	@Auth()
	async getVideoPrivate(
		@Param('videoId', new ParseIdToIntPipe()) videoId: number
	): Promise<VideoEntity> {
		return this.videoService.findVideoById(videoId);
	}

	@Get(':videoId')
	@ApiResponse({
		status: 200,
		description: 'Get video by Id',
		type: VideoEntity
	})
	async getVideo(
		@Param('videoId', new ParseIdToIntPipe()) videoId: number
	): Promise<VideoEntity> {
		return this.videoService.findVideoById(videoId);
	}

	@Post()
	@ApiResponse({
		status: 200,
		description: 'Video created',
		type: Number
	})
	@HttpCode(200)
	@Auth()
	async createVideo(@CurrentUser('id') id: number): Promise<number> {
		return this.videoService.createVideo(id);
	}

	@Put(':videoId')
	@ApiResponse({
		status: 200,
		description: 'Video info updated',
		type: VideoEntity
	})
	@ApiBody({ type: VideoDto })
	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	async updateVideoInfo(
		@Param('videoId', new ParseIdToIntPipe()) videoId: number,
		@Body() dto: VideoDto
	): Promise<VideoEntity> {
		return this.videoService.updateVideoInfo(videoId, dto);
	}

	@Post('video-file/:videoId')
	@ApiResponse({
		description: 'Video file uploaded',
		type: PublicFileEntity,
		status: 200
	})
	@HttpCode(200)
	@UseInterceptors(FileInterceptor('file'))
	@Auth()
	async uploadVideoFile(
		res,
		@Param('videoId', new ParseIdToIntPipe()) videoId: number,
		@UploadedFile(
			new ParseFilePipe({
				validators: [new FileTypeValidator({ fileType: VALID_VIDEO_TYPES })]
			})
		)
		file: Express.Multer.File
	): Promise<PublicFileEntity> {
		return this.videoService.uploadVideoFile(
			videoId,
			file.buffer,
			file.originalname
		);
	}

	@Post('thumbnail/:videoId')
	@ApiResponse({
		description: 'Thumbnail file uploaded',
		type: PublicFileEntity,
		status: 200
	})
	@HttpCode(200)
	@UseInterceptors(FileInterceptor('file'))
	@Auth()
	async uploadThumbnailFile(
		@Param('videoId', new ParseIdToIntPipe()) videoId: number,
		@UploadedFile(
			new ParseFilePipe({
				validators: [new FileTypeValidator({ fileType: VALID_IMAGES_TYPES })]
			}),
			SharpPipe
		)
		file: Express.Multer.File
	): Promise<PublicFileEntity> {
		return this.videoService.uploadThumbnailFile(
			videoId,
			file.buffer,
			file.originalname
		);
	}

	@Delete(':videoId')
	@ApiResponse({
		status: 200,
		description: 'The video is deleted'
	})
	@HttpCode(200)
	@Auth()
	async deleteVideo(@Param('videoId', new ParseIdToIntPipe()) videoId: number) {
		return this.videoService.deleteVideo(videoId);
	}

	@Put('update-views/:videoId')
	@ApiResponse({
		status: 200,
		description: 'Counter of views is incremented',
		type: VideoEntity
	})
	@HttpCode(200)
	async updateViews(
		@Param('videoId', new ParseIdToIntPipe()) videoId: number
	): Promise<VideoEntity> {
		return this.videoService.updateCountOfViews(videoId);
	}

	@Put('update-likes/:videoId')
	@ApiResponse({
		status: 200,
		description: 'Counter of likes is incremented',
		type: IsBoolean
	})
	@Auth()
	@HttpCode(200)
	async updateLikes(
		@Param('videoId', new ParseIdToIntPipe()) videoId: number,
		@CurrentUser('id') id: number
	): Promise<boolean> {
		return this.videoService.updateCountOfLikes(videoId, id);
	}
}
