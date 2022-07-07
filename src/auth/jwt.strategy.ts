import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 
	//passport-jwt Node.js package를 사용하기 위해서 strategy를 passing.
	
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository
	) {
		super({
			secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'), 
			//토큰이 유효한지 체크하기 위해서 사용한다.
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
			//토큰 가져올때 Authorization Header에서 Bearer 타입의 토큰으로 가져오고, secret key로 유효한지 확인.
		})
	}

	//위에서 토큰이 유효한지 체크가 되면 validate 메소드에서 payload에 있는 유저이름이 데이터베이스에서 있는 유저인지 확인
	//있다면 유저 객체를 return. return값은 @UseGuards(AuthGuard())를 이용한 모든 요청의 Request Object에 들어간다.
	async validate(payload) {
		const { username } = payload;
		const user: User = await this.userRepository.findOne({ username });
	
		if(!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
