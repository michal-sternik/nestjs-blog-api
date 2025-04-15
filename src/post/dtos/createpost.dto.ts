import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @ApiProperty({ example: 'testTitle' })
  title: string;

  @IsString()
  @ApiProperty({ example: 'testContent' })
  content: string;
}
