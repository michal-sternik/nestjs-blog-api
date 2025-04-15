import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SafeUserWithoutPostsDto } from 'src/user/types/safeuserwithoutposts.dto';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'Test title' })
  title: string;

  @Column()
  @ApiProperty({ example: 'Test content' })
  content: string;

  @ApiProperty({ type: () => SafeUserWithoutPostsDto })
  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
