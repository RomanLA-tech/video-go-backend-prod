import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { CommentDto } from './comment.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentEntity } from './comment.entity';
import { ParseIdToIntPipe } from '../utils/pipes/parse-id-to-int.pipe';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@ApiResponse({
		status: 200,
		description: 'Comment added successful!',
		type: CommentEntity
	})
	@ApiBody({ type: CommentDto })
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async createComment(
		@CurrentUser('id', new ParseIdToIntPipe()) id: number,
		@Body() dto: CommentDto
	): Promise<CommentEntity> {
		return this.commentService.createComment(id, dto);
	}
}
