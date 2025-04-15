import { ApiProperty } from '@nestjs/swagger';

export class SafeUserWithoutPostsDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'testUsername' })
  username: string;

  @ApiProperty({ example: 'testEmail' })
  email: string;
}
