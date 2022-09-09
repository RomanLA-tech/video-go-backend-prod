import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform
} from '@nestjs/common';

@Injectable()
export class ParseIdToIntPipe implements PipeTransform<string, number> {
	transform(value: string, metadata: ArgumentMetadata): number {
		const val = parseInt(value, 10);
		if (isNaN(val)) {
			throw new BadRequestException('ID must be a number!');
		}
		return val;
	}
}
