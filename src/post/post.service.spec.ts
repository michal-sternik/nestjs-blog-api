import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { UserService } from 'src/user/user.service';
import {
  PostNotFoundException,
  WrongUserAccessException,
} from 'src/exceptions/exceptions';

describe('PostService', () => {
  let service: PostService;

  const mockPostRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {
    getUserByIdWithoutPosts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createPost', () => {
    it('should return new post', async () => {
      const userId = 1;
      const createPostDto = { title: 'testTitle', content: 'testContent' };

      const user = {
        id: userId,
        username: 'testUsername',
        email: 'testEmail',
      };

      const createdPost = { id: 1, ...createPostDto, user };

      mockUserService.getUserByIdWithoutPosts.mockResolvedValue(user);
      mockPostRepository.create.mockReturnValue(createdPost);
      mockPostRepository.save.mockResolvedValue(createdPost);
      const newPost = await service.createPost(userId, createPostDto);

      expect(newPost).toEqual(createdPost);
      expect(mockUserService.getUserByIdWithoutPosts).toHaveBeenCalledWith(
        userId,
      );
      expect(mockPostRepository.create).toHaveBeenCalledWith({
        ...createPostDto,
        user,
      });
      expect(mockPostRepository.save).toHaveBeenCalledWith(createdPost);
    });
  });
  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      const posts = [
        { id: 1, title: 'Post 1', content: 'Content 1', user: { id: 1 } },
        { id: 2, title: 'Post 2', content: 'Content 2', user: { id: 2 } },
      ];

      mockPostRepository.find.mockResolvedValue(posts);

      const result = await service.getAllPosts();

      expect(result).toEqual(posts);
      expect(mockPostRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
      });
    });
  });
  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const postId = 1;
      const post = {
        id: postId,
        title: 'Post 1',
        content: 'Content 1',
        user: { id: 1, username: 'testUsername', email: 'testEmail@email.com' },
      };

      mockPostRepository.findOne.mockResolvedValue(post);

      const result = await service.getPostById(postId);

      expect(result).toEqual(post);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
        relations: ['user'],
      });
    });

    it('should throw PostNotFoundException if post does not exist', async () => {
      const postId = 999;

      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(service.getPostById(postId)).rejects.toThrow(
        PostNotFoundException,
      );
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
        relations: ['user'],
      });
    });
  });
  describe('editPost', () => {
    it('should edit a post and return the updated post', async () => {
      const userId = 1;
      const postId = 1;
      const editPostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      const existingPost = {
        id: postId,
        title: 'Old Title',
        content: 'Old Content',
        user: { id: 1, username: 'testUsername', email: 'testEmail@email.com' },
      };

      const updatedPost = { ...existingPost, ...editPostDto };

      const fullPost = {
        ...updatedPost,
        user: { id: 1, username: 'testUsername', email: 'testEmail@email.com' },
      };

      mockPostRepository.findOne
        .mockResolvedValueOnce(existingPost)
        .mockResolvedValueOnce(fullPost);
      mockPostRepository.save.mockResolvedValue(updatedPost);

      const result = await service.editPost(userId, postId, editPostDto);

      expect(result).toEqual(fullPost);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
        relations: ['user'],
      });
      expect(mockPostRepository.save).toHaveBeenCalledWith(updatedPost);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: updatedPost.id },
        relations: ['user'],
      });
    });

    it('should throw PostNotFoundException if post does not exist', async () => {
      const userId = 1;
      const postId = 1;
      const editPostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(
        service.editPost(userId, postId, editPostDto),
      ).rejects.toThrow(PostNotFoundException);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
        relations: ['user'],
      });
    });

    it('should throw WrongUserAccessException if user does not own the post', async () => {
      const userId = 1;
      const postId = 1;
      const editPostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      const existingPost = {
        id: postId,
        title: 'Old Title',
        content: 'Old Content',
        user: { id: 2 },
      };

      mockPostRepository.findOne.mockResolvedValue(existingPost);

      await expect(
        service.editPost(userId, postId, editPostDto),
      ).rejects.toThrow(WrongUserAccessException);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
        relations: ['user'],
      });
    });
  });
  describe('deletePostById', () => {
    it('should delete a post and return the result', async () => {
      const userId = 1;
      const postId = 1;

      const postToDelete = {
        id: postId,
        title: 'Title1',
        content: 'Content1',
        user: {
          id: userId,
          username: 'testUsername',
          email: 'testEmail@email.com',
        },
      };

      const deleteResult = { affected: 1 };

      mockPostRepository.findOne.mockResolvedValue(postToDelete);
      mockPostRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.deletePostById(userId, postId);

      expect(result).toEqual(deleteResult);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
        relations: ['user'],
      });
      expect(mockPostRepository.delete).toHaveBeenCalledWith(postToDelete.id);
    });

    it('should throw PostNotFoundException if post does not exist', async () => {
      const userId = 1;
      const postId = 999;

      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(service.deletePostById(userId, postId)).rejects.toThrow(
        PostNotFoundException,
      );
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
        relations: ['user'],
      });
    });

    it('should throw WrongUserAccessException if user does not own the post', async () => {
      const userId = 1;
      const postId = 1;

      const postToDelete = {
        id: postId,
        title: 'Post to delete',
        content: 'Content',
        user: {
          id: 2, // != userId
          username: 'testUsername',
          email: 'testEmail@email.com',
        },
      };

      mockPostRepository.findOne.mockResolvedValue(postToDelete);

      await expect(service.deletePostById(userId, postId)).rejects.toThrow(
        WrongUserAccessException,
      );
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
        relations: ['user'],
      });
    });
  });
});
