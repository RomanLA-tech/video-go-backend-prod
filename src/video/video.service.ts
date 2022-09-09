import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm';
import { VideoEntity } from './video.entity';
import { VideoDto } from './video.dto';
import { MediaService } from '../media/media.service';
import { THUMBNAILS, VIDEOS } from '../utils/regex-and-constants';
import { LikeEntity } from './like.entity';

@Injectable()
export class VideoService {
	constructor(
		@InjectRepository(VideoEntity)
		private readonly videoRepository: Repository<VideoEntity>,
		@InjectRepository(LikeEntity)
		private readonly likeRepository: Repository<LikeEntity>,
		private mediaService: MediaService
	) {}

	async findVideoById(id: number, isPublic = false) {
		const video = await this.videoRepository.findOne({
			where: isPublic ? { id, isPublic: true } : { id },
			relations: {
				user: true,
				comments: { user: true }
			},
			select: {
				user: {
					id: true,
					name: true,
					avatar: {
						key: true
					},
					isVerified: true,
					subscribersCount: true,
					subscriptions: true
				},
				comments: {
					message: true,
					id: true,
					user: {
						id: true,
						name: true,
						avatar: {
							key: true
						},
						isVerified: true,
						subscribersCount: true,
						subscriptions: true
					}
				}
			}
		});
		if (!video) throw new NotFoundException('Video is not found');
		return video;
	}

	async createVideo(userId: number) {
		const defaultValue = {
			name: 'Untitled',
			description: '',
			videoFile: null,
			thumbnail: null,
			user: { id: userId }
		};
		const newVideo = this.videoRepository.create(defaultValue);
		const video = await this.videoRepository.save(newVideo);
		return video.id;
	}

	async updateVideoInfo(videoId: number, dto: VideoDto) {
		const video = await this.findVideoById(videoId);
		return this.videoRepository.save({
			...video,
			...dto
		});
	}

	async uploadVideoFile(
		videoId: number,
		videoBuffer: Buffer,
		filename: string
	) {
		const folder = VIDEOS;
		const video = await this.findVideoById(videoId);
		if (video.videoFile) {
			await this.videoRepository.update(videoId, {
				videoFile: null,
				duration: 0
			});
			await this.mediaService.deletePublicFile(video.videoFile.id);
		}
		const videoFile = await this.mediaService.uploadPublicFile(
			videoBuffer,
			filename,
			folder
		);

		const start = videoBuffer.indexOf(Buffer.from('mvhd')) + 17;
		const timeScale = videoBuffer.readUInt32BE(start);
		const fileDuration = videoBuffer.readUInt32BE(start + 4);
		const duration = Math.floor(fileDuration / timeScale);

		await this.videoRepository.update(videoId, {
			videoFile,
			duration
		});
		return videoFile;
	}

	async uploadThumbnailFile(
		videoId: number,
		imageBuffer: Buffer,
		filename: string
	) {
		const folder = THUMBNAILS;
		const video = await this.findVideoById(videoId);
		if (video.thumbnail) {
			await this.videoRepository.update(videoId, {
				thumbnail: null
			});
			await this.mediaService.deletePublicFile(video.thumbnail.id);
		}
		const thumbnail = await this.mediaService.uploadPublicFile(
			imageBuffer,
			filename,
			folder
		);
		await this.videoRepository.update(videoId, {
			thumbnail
		});

		return thumbnail;
	}

	async deleteVideo(id: number) {
		const video = await this.findVideoById(id);

		if (!!video.thumbnail) {
			await this.mediaService.deletePublicFile(video.thumbnail.id);
		}

		if (!!video.videoFile) {
			await this.mediaService.deletePublicFile(video.videoFile.id);
		}
		return this.videoRepository.delete({ id });
	}

	async updateCountOfViews(id: number) {
		const video = await this.findVideoById(id);
		video.views++;
		return this.videoRepository.save(video);
	}

	async updateCountOfLikes(videoId: number, id: number) {
		const likeData = {
			video: { id: videoId },
			fromUser: { id }
		};

		const video = await this.findVideoById(videoId);

		const isLike = await this.likeRepository.findOneBy(likeData);

		if (!isLike) {
			const newLike = await this.likeRepository.create(likeData);

			await this.likeRepository.save(newLike);
			video.likesCount++;
			await this.videoRepository.save(video);

			return true;
		}

		await this.likeRepository.delete(likeData);
		video.likesCount--;
		await this.videoRepository.save(video);
		return false;
	}

	async getAllVideos(searchTerm?: string) {
		let options: FindOptionsWhereProperty<VideoEntity> = {};

		if (searchTerm)
			options = {
				name: ILike(`%${searchTerm}%`)
			};

		return this.videoRepository.find({
			where: { ...options, isPublic: true },
			order: { createdAt: 'DESC' },
			relations: {
				user: true,
				comments: {
					user: true
				},
				likedUsers: {
					fromUser: true
				}
			},
			select: {
				user: {
					id: true,
					name: true,
					avatar: {
						key: true
					},
					isVerified: true
				}
			}
		});
	}

	async getMostPopularByView() {
		return this.videoRepository.find({
			where: { views: MoreThan(0), isPublic: true },
			relations: { user: true },
			select: {
				user: { id: true, name: true, avatar: { key: true }, isVerified: true }
			}
		});
	}
}
