import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../utils/db/base';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../user/user.entity';
import { VideoEntity } from './video.entity';

@Entity('Like')
export class LikeEntity extends Base {
	@ApiProperty({
		description: 'Like from users',
		type: () => UserEntity
	})
	@ManyToOne(() => UserEntity, user => user.subscriptions)
	@JoinColumn({ name: 'like_from_user_id' })
	fromUser: UserEntity;

	@ApiProperty({
		description: 'Like for video',
		type: () => VideoEntity
	})
	@ManyToOne(() => VideoEntity, video => video.likedUsers)
	@JoinColumn({ name: 'liked_video_id' })
	video: VideoEntity;
}
