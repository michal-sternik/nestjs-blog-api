import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

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

  async getUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
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
}
