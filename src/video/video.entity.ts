import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { Base } from '../utils/db/base';
import { CommentEntity } from '../comment/comment.entity';
import PublicFileEntity from '../media/publicFile.entity';
import { ApiProperty } from '@nestjs/swagger';
import { LikeEntity } from './like.entity';

@Entity('Video')
export class VideoEntity extends Base {
	@ApiProperty({ default: '' }) @Column({ default: '' }) public name: string;

	@ApiProperty({ default: false })
	@Column({ default: false, name: 'is_public' })
	public isPublic: boolean;

	@ApiProperty({ default: 0, required: false })
	@Column({ default: 0 })
	public views?: number;

	@ApiProperty({ default: 0, required: false })
	@Column({ default: 0 })
	public likesCount?: number;

	@ApiProperty({ default: 0 }) @Column({ default: 0 }) duration?: number;

	@ApiProperty({ default: '' })
	@Column({ default: '', type: 'text' })
	description: string;

	@ApiProperty({ type: () => PublicFileEntity, required: false })
	@JoinColumn()
	@OneToOne(() => PublicFileEntity, {
		eager: true,
		nullable: true
	})
	public videoFile?: PublicFileEntity;

	@ApiProperty({ type: () => PublicFileEntity, required: false })
	@JoinColumn()
	@OneToOne(() => PublicFileEntity, {
		eager: true,
		nullable: true
	})
	public thumbnail?: PublicFileEntity;

	@ApiProperty({ type: () => UserEntity })
	@ManyToOne(() => UserEntity, user => user.videos)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;

	@ApiProperty({
		type: () => [CommentEntity]
	})
	@OneToMany(() => CommentEntity, comment => comment.video)
	comments: CommentEntity[];

	@ApiProperty({
		type: () => [LikeEntity]
	})
	@OneToMany(() => LikeEntity, like => like.video)
	likedUsers: LikeEntity[];
}
