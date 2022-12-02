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
	host: configService.get<string>('PGHOST'),
	port: configService.get<number>('PGPORT'),
	database: configService.get<string>('PGDATABASE'),
	username: configService.get<string>('PGUSER'),
	password: configService.get<string>('PGPASSWORD'),
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
