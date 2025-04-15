import { ApiProperty } from '@nestjs/swagger';
import { PostDto } from './../../post/dtos/post.dto';

export class SafeUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'testUser123' })
  username: string;

  @ApiProperty({ example: 'testUser123@testMail.com' })
  email: string;

  @ApiProperty({ type: [PostDto] })
  posts: PostDto[];
}
