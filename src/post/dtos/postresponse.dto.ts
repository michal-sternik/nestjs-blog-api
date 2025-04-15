import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/entities/post.entity';
import { SafeUserWithoutPostsDto } from 'src/user/types/safeuserwithoutposts.dto';

export class PostResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'testTitle' })
  title: string;

  @ApiProperty({ example: 'testContent' })
  content: string;

  @ApiProperty({ type: () => SafeUserWithoutPostsDto })
  user: SafeUserWithoutPostsDto;

  constructor(post: Post) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.user = {
      id: post.user.id,
      username: post.user.username,
      email: post.user.email,
    };
  }
}
