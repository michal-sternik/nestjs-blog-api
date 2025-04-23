import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { SafeUserDto } from './types/safeuser.dto';
import { PostDto } from 'src/post/dtos/post.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    description: 'User profile loaded successfully',
    type: SafeUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or not provided access token',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request – invalid payload (missing/invalid fields)',
  })
  @ApiOperation({
    summary: 'Protected route - Returns full user entity profile',
  })
  @Get('profile')
  async getProfile(@Req() request: { user: { id: number } }) {
    return await this.userService.getUserById(request.user.id);
  }

  @ApiOkResponse({
    description: 'User posts loaded successfully',
    type: [PostDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or not provided access token',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request – invalid payload (missing/invalid fields)',
  })
  @ApiOperation({
    summary:
      'Protected route - Returns logged user posts (id taken from token)',
  })
  @Get('posts')
  async getUserPosts(@Req() request: { user: { id: number } }) {
    return await this.userService.getUserPosts(request.user.id);
  }
}
