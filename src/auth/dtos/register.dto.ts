import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'username - must be unique',
    example: 'testUser123',
  })
  @MinLength(2)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: 'email - must be unique',
    example: 'testUser123@testMail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password - must be strong - minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,',
    example: 'YourStr0ngP@ssw0rd!',
  })
  @IsStrongPassword()
  password: string;
}
