import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import * as config from 'config'

const jwtConfig = config.get('jwt');
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWR_SECRET || jwtConfig.secret, //토큰 만들때 이용하는 secret 텍스트
      signOptions: {
        expiresIn: jwtConfig.expiresIn, // 60 * 60은 1시간 이후에는 이 토큰이 더이상 유효하지 않음.
      }
    }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], //JwtStrategy를 이 Auth 모듈에서 사용할수 있게 등록
  exports: [JwtStrategy, PassportModule] //JwtStrategy, PassportModule를 다른 모듈에서 사용할 수 있게 등록
})
export class AuthModule {}
