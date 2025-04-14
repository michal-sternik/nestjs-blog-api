import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthJwtPayload } from '../types/jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') as string,
      ignoreExpiration: false,
    });
  }
  async validate(payload: AuthJwtPayload) {
    const userId = payload.sub;
    //we can return something from validateJwtUser (for example email) if needed
    await this.authService.validateJwtUser(userId);
    return { id: userId };
  }
}
