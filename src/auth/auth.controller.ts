import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/signup')
	signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
		return this.authService.signUp(authCredentialsDto);
	}

	@Post('/signin')
	signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
		return this.authService.signIn(authCredentialsDto);
	}

	@Post('/test')
	@UseGuards(AuthGuard()) //요청 안에 유저 객체 들어가도록.
	authTest(@GetUser() user: User) {
		console.log('user', user);
	}
}
