import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import {
  DuplicateEmailException,
  DuplicateUsernameException,
  UserNotFoundException,
  WrongPasswordException,
} from 'src/exceptions/exceptions';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const checkExistingUser = await this.userService.getUserByEmailOrUsername(
      registerDto.email,
      registerDto.username,
    );
    if (checkExistingUser) {
      if (checkExistingUser.username === registerDto.username) {
        throw new DuplicateUsernameException(registerDto.username);
      } else if (checkExistingUser.email === registerDto.email) {
        throw new DuplicateEmailException(registerDto.email);
      }
    }

    const salt = await bcrypt.genSalt();
    registerDto.password = await bcrypt.hash(registerDto.password, salt);

    const newUser = await this.userService.saveUser(registerDto);

    return newUser.id;
  }

  async validatUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new UserNotFoundException(email);

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new WrongPasswordException();
    return { id: user.id };
  }

  login(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new UserNotFoundException(userId.toString());
    return user.id;
  }
}
