import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';
import { VideoEntity } from '../video/video.entity';
import { SubscriptionEntity } from '../user/subscription.entity';
import PublicFileEntity from '../media/publicFile.entity';
import { ConfigService } from '@nestjs/config';
import { LikeEntity } from '../video/like.entity';

export const getTypeOrmConfig = async (
	configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
	type: 'postgres',
	url: configService.get<string>('DATABASE_URL'),
	ssl: { rejectUnauthorized: false },
	host: configService.get<string>('POSTGRES_HOST'),
	port: configService.get<number>('POSTGRES_PORT'),
	database: configService.get<string>('POSTGRES_DB'),
	username: configService.get<string>('POSTGRES_USER'),
	password: configService.get<string>('POSTGRES_PASSWORD'),
	autoLoadEntities: true,
	synchronize: true,
	entities: [
		UserEntity,
		CommentEntity,
		VideoEntity,
		SubscriptionEntity,
		PublicFileEntity,
		LikeEntity
	]
});
