import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [PostService],
  controllers: [PostController],
  imports: [UserModule, TypeOrmModule.forFeature([Post])],
})
export class PostModule {}
