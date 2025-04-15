import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/createpost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import {
  PostNotFoundException,
  WrongUserAccessException,
} from 'src/exceptions/exceptions';
import { EditPostDto } from './dtos/editPost.dto';
import { PostResponseDto } from './dtos/postresponse.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) {}
  async getAllPosts() {
    const posts = await this.postRepository.find({ relations: ['user'] });
    return posts.map((post) => new PostResponseDto(post));
  }
  async getPostById(postId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) throw new PostNotFoundException(postId);

    return new PostResponseDto(post);
  }
  async createPost(userId: number, createPostDto: CreatePostDto) {
    const user = await this.userService.getUserByIdWithoutPosts(userId);
    const newPost = this.postRepository.create({
      ...createPostDto,
      user,
    });
    return await this.postRepository.save(newPost);
  }
  async editPost(
    userId: number,
    editedPostId: number,
    editPostDto: EditPostDto,
  ) {
    const editedPost = await this.postRepository.findOne({
      where: { id: editedPostId },
      relations: ['user'],
    });
    if (!editedPost) throw new PostNotFoundException(editedPostId);
    if (editedPost.user.id !== userId)
      throw new WrongUserAccessException(userId, editedPost.id);

    Object.assign(editedPost, editPostDto);
    const saved = await this.postRepository.save(editedPost);
    //we call database once again to receive full object (with title, content) when we update partially
    const full = await this.postRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
    return new PostResponseDto(full!);
  }
  async deletePostById(userId: number, postId: number) {
    const postToDelete = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!postToDelete) throw new PostNotFoundException(postId);
    if (postToDelete.user.id !== userId)
      throw new WrongUserAccessException(userId, postToDelete.id);

    return await this.postRepository.delete(postToDelete.id);
  }
}
