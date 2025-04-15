import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/createpost.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EditPostDto } from './dtos/editPost.dto';
import { SafeUserDto } from 'src/user/types/safeuser.dto';
import { PostDto } from './dtos/post.dto';
import { Post as PostEntity } from './../entities/post.entity';
import { PostResponseDto } from './dtos/postresponse.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @ApiOkResponse({
    description: 'Post list loaded successfully',
    type: [PostEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or not provided access token',
  })
  @ApiOperation({
    summary: 'Protected route - Returns full post list',
  })
  @Get()
  async getAllPosts() {
    return await this.postService.getAllPosts();
  }

  @ApiOkResponse({
    description: 'Post loaded successfully',
    type: PostEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or not provided access token',
  })
  @ApiOperation({
    summary: 'Protected route - Returns post with specified id',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the post to be returned',
    type: Number,
    example: 1,
  })
  @Get(':id')
  async getPostById(@Param('id') postId: number) {
    return await this.postService.getPostById(postId);
  }

  @ApiOperation({ summary: 'Protected route - Create a new post' })
  @ApiCreatedResponse({
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request – invalid payload (missing/invalid fields)',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or not provided access token',
  })
  @Post()
  async createPost(
    @Req() request: { user: { id: number } },
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.createPost(request.user.id, createPostDto);
  }

  @ApiOperation({ summary: 'Protected route - Edit post with specified id' })
  @ApiOkResponse({
    description: 'Post edited successfully',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request – invalid payload (missing/invalid fields)',
  })
  @ApiForbiddenResponse({
    description: 'User id is not equal to edited post id',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or not provided access token',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the post to be edited',
    type: Number,
    example: 2,
  })
  @Patch(':id')
  async editPost(
    @Req() request: { user: { id: number } },
    @Param('id') editedPostId: number,
    @Body() editPostDto: EditPostDto,
  ) {
    return await this.postService.editPost(
      request.user.id,
      editedPostId,
      editPostDto,
    );
  }

  @ApiOperation({ summary: 'Protected route - Delete post with specified id' })
  @ApiOkResponse({
    description: 'Post deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request – invalid payload (missing/invalid fields)',
  })
  @ApiForbiddenResponse({
    description: 'User id is not equal to edited post id',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or not provided access token',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the post to be deleted',
    type: Number,
    example: 1,
  })
  @Delete(':id')
  async deletePost(
    @Req() request: { user: { id: number } },
    @Param('id') postId: number,
  ) {
    return await this.postService.deletePostById(request.user.id, postId);
  }
}
