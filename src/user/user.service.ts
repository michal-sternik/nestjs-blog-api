import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { User } from './../entities/user.entity';
import { UserNotFoundException } from 'src/exceptions/exceptions';
import { Repository } from 'typeorm';
import { SafeUserDto } from './types/safeuser.dto';
import { PostDto } from 'src/post/dtos/post.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async getUserById(id: number): Promise<SafeUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new UserNotFoundException(id.toString());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async getUserByIdWithoutPosts(id: number): Promise<SafeUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UserNotFoundException(id.toString());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async getUserByEmailOrUsername(email: string, username: string) {
    return await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
  }
  async saveUser(registerDtoWithHashedPassword: RegisterDto) {
    const newUser = this.userRepository.create(registerDtoWithHashedPassword);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getUserPosts(id: number): Promise<PostDto[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new UserNotFoundException(id.toString());
    }
    return user.posts;
  }
}
