import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [UserModule, JwtModule.registerAsync(jwtConfig.asProvider())],
})
export class AuthModule {}
