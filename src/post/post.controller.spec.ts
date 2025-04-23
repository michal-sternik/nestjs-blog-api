import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/createpost.dto';
import { EditPostDto } from './dtos/editPost.dto';
import { SafeUserWithoutPostsDto } from 'src/user/types/safeuserwithoutposts.dto';
import { PostResponseDto } from './dtos/postresponse.dto';

describe('PostController', () => {
  let controller: PostController;

  const mockPostService = {
    getAllPosts: jest.fn(),
    getPostById: jest.fn(),
    createPost: jest.fn(),
    editPost: jest.fn(),
    deletePostById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: mockPostService }],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      const posts = [
        { id: 1, title: 'testTitle1', content: 'testContent1' },
        { id: 2, title: 'testTitle2', content: 'testContent2' },
      ];

      mockPostService.getAllPosts.mockResolvedValue(posts);
      const result = await controller.getAllPosts();

      expect(result).toEqual(posts);
      expect(mockPostService.getAllPosts).toHaveBeenCalled();
    });
  });

  describe('getPostById', () => {
    it('should return a single post', async () => {
      const postId = 1;
      const post = { id: 1, title: 'testTitle1', content: 'testContent1' };
      mockPostService.getPostById.mockResolvedValue(post);
      const result = await controller.getPostById(postId);

      expect(result).toEqual(post);
      expect(mockPostService.getPostById).toHaveBeenCalledWith(postId);
    });
  });

  describe('createPost', () => {
    it('should return created post', async () => {
      const request = { user: { id: 1 } };
      const postDto: CreatePostDto = {
        title: 'testTitle1',
        content: 'testContent1',
      };
      const newPost = { id: 1, title: 'testTitle1', content: 'testContent1' };
      mockPostService.createPost.mockResolvedValue(newPost);
      const result = await controller.createPost(request, postDto);

      expect(result).toEqual(newPost);
      expect(mockPostService.createPost).toHaveBeenCalledWith(
        request.user.id,
        postDto,
      );
    });
  });
  describe('editPost', () => {
    it('should return edited post with an user', async () => {
      const request = { user: { id: 1 } };
      const postId = 1;
      const postDto: EditPostDto = {
        title: 'testTitle1',
        content: 'testContent2',
      };

      const user: SafeUserWithoutPostsDto = {
        id: 1,
        username: 'testUsername',
        email: 'testEmail@email.com',
      };

      const newPost: PostResponseDto = {
        id: request.user.id,
        title: 'testTitle1',
        content: 'testContent2',
        user,
      };

      mockPostService.editPost.mockResolvedValue(newPost);
      const result = await controller.editPost(request, postId, postDto);

      expect(result).toEqual(newPost);
      expect(mockPostService.editPost).toHaveBeenCalledWith(
        request.user.id,
        postId,
        postDto,
      );
    });
  });
  describe('deletePost', () => {
    it('should return an information that post was deleted (affected)', async () => {
      const request = { user: { id: 1 } };
      const postId = 1;
      const deleteResult = { affected: 1 };

      mockPostService.deletePostById.mockResolvedValue(deleteResult);
      const result = await controller.deletePost(request, postId);

      expect(result).toEqual(deleteResult);
      expect(mockPostService.deletePostById).toHaveBeenCalledWith(
        request.user.id,
        postId,
      );
    });
  });
});
