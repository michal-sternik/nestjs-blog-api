import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'testTitle' })
  title: string;

  @ApiProperty({ example: 'testContent' })
  content: string;
}
