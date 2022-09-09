import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../utils/db/base';
import { UserEntity } from '../user/user.entity';
import { VideoEntity } from '../video/video.entity';
import { ApiProperty } from '@nestjs/swagger';
import { NestedId } from '../utils/swagger/common-types-for-swagger';

@Entity('Comment')
export class CommentEntity extends Base {
	@ApiProperty() @Column({ type: 'text' }) message: string;

	@ApiProperty({
		type: () => NestedId
	})
	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;

	@ApiProperty({
		type: () => NestedId
	})
	@ManyToOne(() => VideoEntity, video => video.comments)
	@JoinColumn({ name: 'video_id' })
	video: VideoEntity;
}
