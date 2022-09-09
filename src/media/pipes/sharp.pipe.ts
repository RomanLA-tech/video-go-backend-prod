import { Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';

@Injectable()
export class SharpPipe
	implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>>
{
	async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
		const originalName = path.parse(file.originalname).name;
		const filename = 'optimized-' + originalName + '.webp';

		const buffer = await sharp(file.buffer, { animated: true })
			.webp({ effort: 3 })
			.toBuffer();

		return { ...file, buffer, originalname: filename };
	}
}
