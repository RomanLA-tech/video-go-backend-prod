import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne
} from 'typeorm';
import { VideoEntity } from '../video/video.entity';
import { Base } from '../utils/db/base';
import { SubscriptionEntity } from './subscription.entity';
import { ApiProperty } from '@nestjs/swagger';
import PublicFileEntity from '../media/publicFile.entity';
import { LikeEntity } from '../video/like.entity';

@Entity('User')
export class UserEntity extends Base {
	@ApiProperty() @Column({ unique: true }) email: string;

	@ApiProperty() @Column({ select: false }) password: string;

	@ApiProperty({
		default: 'New user'
	})
	@Column({ default: 'New user' })
	name: string;

	@ApiProperty()
	@Column({
		default: false,
		name: 'is_verified'
	})
	isVerified: boolean;

	@ApiProperty({
		required: false
	})
	@Column({
		default: 0,
		name: 'subscribers_count'
	})
	subscribersCount?: number;

	@ApiProperty({
		required: false
	})
	@Column({
		default: '',
		type: 'text'
	})
	description: string;

	@ApiProperty({
		required: false,
		type: () => PublicFileEntity
	})
	@JoinColumn()
	@OneToOne(() => PublicFileEntity, {
		eager: true,
		nullable: true
	})
	avatar?: PublicFileEntity;

	@ApiProperty({
		type: () => [VideoEntity]
	})
	@OneToMany(() => VideoEntity, video => video.user)
	videos: VideoEntity[];

	@ApiProperty({
		type: () => [SubscriptionEntity]
	})
	@OneToMany(() => SubscriptionEntity, sub => sub.fromUser)
	subscriptions: SubscriptionEntity[];

	@ApiProperty({
		type: () => [SubscriptionEntity]
	})
	@ManyToOne(() => SubscriptionEntity, sub => sub.toChannel)
	subscribers: SubscriptionEntity[];

	@ApiProperty({
		type: () => [LikeEntity]
	})
	@OneToMany(() => LikeEntity, like => like.fromUser)
	likedVideos: LikeEntity[];
}
