import {
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpCode,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	Put,
	UploadedFile,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserEntity } from './user.entity';
import { VALID_IMAGES_TYPES } from '../utils/regex-and-constants';
import { SharpPipe } from '../media/pipes/sharp.pipe';
import { ParseIdToIntPipe } from '../utils/pipes/parse-id-to-int.pipe';
import PublicFileEntity from '../media/publicFile.entity';

@ApiTags('Users')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@ApiResponse({
		status: 200,
		description: 'Get auth user profile',
		type: UserEntity
	})
	@Auth()
	async getProfile(@CurrentUser('id') id: number): Promise<UserEntity> {
		return this.userService.findUserById(id);
	}

	@Get('by-id/:id')
	@ApiResponse({
		status: 200,
		description: 'Get user profile by Id',
		type: UserEntity
	})
	async getUser(
		@Param('id', new ParseIdToIntPipe()) id: number
	): Promise<UserEntity> {
		return this.userService.findUserById(id);
	}

	@Put('edit')
	@ApiResponse({
		status: 200,
		description: 'Updated profile info',
		type: UserEntity
	})
	@ApiBody({ type: UserDto, description: 'User ID' })
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async updateProfileInfo(
		@CurrentUser('id') id: number,
		@Body() dto: UserDto
	): Promise<UserEntity> {
		return this.userService.updateProfileInfo(id, dto);
	}

	@Post('avatar')
	@ApiResponse({
		status: 200,
		description: 'Updated profile avatar',
		type: PublicFileEntity
	})
	@HttpCode(200)
	@UseInterceptors(FileInterceptor('file'))
	@Auth()
	async uploadAvatarFile(
		@CurrentUser('id') id: number,
		@UploadedFile(
			new ParseFilePipe({
				validators: [new FileTypeValidator({ fileType: VALID_IMAGES_TYPES })]
			}),
			SharpPipe
		)
		file: Express.Multer.File
	): Promise<PublicFileEntity> {
		return this.userService.uploadAvatarFile(
			id,
			file.buffer,
			file.originalname
		);
	}

	@Delete('avatar')
	@ApiResponse({
		status: 200,
		description: 'Delete profile avatar',
		type: UserEntity
	})
	@HttpCode(200)
	@Auth()
	async deleteUserAvatar(@CurrentUser('id') id: number): Promise<UserEntity> {
		return this.userService.deleteAvatarFile(id);
	}

	@Patch('subscribe/:channelId')
	@ApiResponse({
		status: 200,
		description: 'Subscribe/Unsubscribe to channelId',
		type: UserEntity
	})
	@HttpCode(200)
	@Auth()
	async subscribeToChannel(
		@CurrentUser('id') id: number,
		@Param('channelId', new ParseIdToIntPipe()) channelId: number
	): Promise<boolean> {
		return this.userService.subscribe(id, channelId);
	}

	@Get('users')
	@ApiResponse({
		status: 200,
		description: 'Get all users',
		type: [UserEntity]
	})
	async getAllUsers(): Promise<UserEntity[]> {
		return this.userService.getAll();
	}
}
