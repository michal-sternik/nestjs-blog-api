import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditPostDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'testTitle' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'testContent' })
  content: string;
}
