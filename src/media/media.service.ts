import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PublicFileEntity from './publicFile.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
	constructor(
		@InjectRepository(PublicFileEntity)
		private publicFilesRepository: Repository<PublicFileEntity>,
		private readonly configService: ConfigService
	) {}

	async uploadPublicFile(dataBuffer: Buffer, filename: string, folder: string) {
		const s3 = new S3();
		try {
			const uploadResult = await s3
				.upload({
					Bucket:
						this.configService.get<string>('AWS_S3_BUCKET_NAME') +
						`/uploads/${folder}`,
					Body: dataBuffer,
					Key: `${uuid()}-${filename}`
				})
				.promise();
			const newFile = this.publicFilesRepository.create({
				key: uploadResult.Key,
				url: uploadResult.Location
			});
			await this.publicFilesRepository.save(newFile);
			return newFile;
		} catch (error) {
			throw new Error( `File uploading failed, error reason: ${error}`);
		}
	}

	async deletePublicFile(id: number) {
		try {
			const file = await this.publicFilesRepository.findOneBy({ id });
			const s3 = new S3();
			await s3
				.deleteObject({
					Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
					Key: file.key
				})
				.promise();
			await this.publicFilesRepository.delete(id);
		} catch (error) {
			return 'File already deleted';
		}
	}
}
