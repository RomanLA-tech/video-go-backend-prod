import { ApiProperty } from '@nestjs/swagger';
import { AuthUserData } from '../utils/swagger/common-types-for-swagger';

export class AuthSuccessfulResponse {
	@ApiProperty({ type: () => AuthUserData }) user: {
		id: number;
		email: string;
	};
	@ApiProperty() accessToken: string;
}
