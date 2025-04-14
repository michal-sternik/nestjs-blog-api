//only for Swagger purposes. currently we're using passport strategy, and this dto won't be used in the logic. it's only to display swagger request body

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'email - must be unique',
    example: 'testUser123@testMail.com',
  })
  email: string;

  @ApiProperty({
    description: 'password, must be strong',
    example: 'YourStr0ngP@ssw0rd!',
  })
  password: string;
}
