import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { UserDto } from './user.dto';
import { genSalt, hash } from 'bcryptjs';
import { MediaService } from '../media/media.service';
import { AVATARS } from '../utils/regex-and-constants';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(SubscriptionEntity)
		private readonly subscriptionRepository: Repository<SubscriptionEntity>,
		private readonly mediaService: MediaService
	) {}

	async findUserById(id: number) {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: {
				videos: true,
				subscriptions: {
					toChannel: true
				}
			},
			order: {
				createdAt: 'DESC'
			}
		});

		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async getAll() {
		return this.userRepository.find();
	}

	async subscribe(id: number, channelId: number) {
		const subscriberData = {
			toChannel: { id: channelId },
			fromUser: { id }
		};

		const user = await this.findUserById(channelId);

		const isSubscription = await this.subscriptionRepository.findOneBy(
			subscriberData
		);

		if (!isSubscription) {
			const newSubscription = await this.subscriptionRepository.create(
				subscriberData
			);

			await this.subscriptionRepository.save(newSubscription);
			user.subscribersCount++;
			await this.userRepository.save(user);

			return true;
		}

		await this.subscriptionRepository.delete(subscriberData);
		user.subscribersCount--;
		await this.userRepository.save(user);
		return false;
	}

	async updateProfileInfo(userId: number, dto: UserDto) {
		const user = await this.findUserById(userId);

		const isSameUser = await this.userRepository.findOneBy({
			email: dto.email
		});
		if (isSameUser && userId !== isSameUser.id)
			throw new BadRequestException('Email is already registered');

		if (dto.password) {
			const salt = await genSalt(10);
			user.password = await hash(dto.password, salt);
		}

		return this.userRepository.save({ ...user, ...dto });
	}

	async uploadAvatarFile(
		userId: number,
		imageBuffer: Buffer,
		filename: string
	) {
		const folder = AVATARS;
		const user = await this.findUserById(userId);
		if (user.avatar) {
			await this.userRepository.update(userId, {
				avatar: null
			});
			await this.mediaService.deletePublicFile(user.avatar.id);
		}
		const avatar = await this.mediaService.uploadPublicFile(
			imageBuffer,
			filename,
			folder
		);
		await this.userRepository.update(userId, { avatar });

		return avatar;
	}

	async deleteAvatarFile(userId: number) {
		const user = await this.findUserById(userId);
		const fileId = user.avatar?.id;
		if (fileId) {
			await this.userRepository.update(userId, { avatar: null });
			await this.mediaService.deletePublicFile(fileId);
		}
		return this.findUserById(userId);
	}
}
