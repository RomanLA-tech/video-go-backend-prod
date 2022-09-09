import { ApiProperty } from '@nestjs/swagger';

export class AuthUserData {
	@ApiProperty() id: string;
	@ApiProperty() email: string;
}

export class NestedId {
	@ApiProperty() id: number;
}
