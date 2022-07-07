import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
	@IsString()
	@MinLength(4)
	@MaxLength(20)
	username: string;

	@IsString()
	@MinLength(4)
	@MaxLength(20)
	//양아링 슷지민 가능한 유효성 체크
	@Matches(/^[a-zA-Z0-9]*$/, {
		message: 'password only accepts english, and number'
	})
	password: string;
}