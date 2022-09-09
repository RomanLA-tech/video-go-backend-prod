import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../utils/db/base';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Subscription')
export class SubscriptionEntity extends Base {
	@ApiProperty({
		description: 'Subscriptions',
		type: () => UserEntity
	})
	@ManyToOne(() => UserEntity, user => user.subscriptions)
	@JoinColumn({ name: 'from_user_id' })
	fromUser: UserEntity;

	@ApiProperty({
		description: 'Subscribers',
		type: () => UserEntity
	})
	@ManyToOne(() => UserEntity, user => user.subscribers)
	@JoinColumn({ name: 'to_channel_id' })
	toChannel: UserEntity;
}
