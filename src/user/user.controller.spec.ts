import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { title } from 'process';

describe('UserController', () => {
  let controller: UserController;
  const mockUserService = {
    getUserById: jest.fn(),
    getUserPosts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getProfile', () => {
    it('should return full user profile', async () => {
      const request = { user: { id: 1 } };
      const result = {
        id: 1,
        username: 'testuser',
        email: 'testemail@email.com',
      };
      mockUserService.getUserById.mockResolvedValue(result);
      const resultValue = await controller.getProfile(request);
      expect(result).toEqual(resultValue);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(request.user.id);
    });
    it('should throw an error if userService.getUserById fails', async () => {
      const request = { user: { id: 1 } };
      mockUserService.getUserById.mockRejectedValue(
        new Error('Something went wrong inside userService'),
      );
      await expect(controller.getProfile(request)).rejects.toThrow(
        'Something went wrong inside userService',
      );
      expect(mockUserService.getUserById).toHaveBeenCalledWith(request.user.id);
    });
  });
  describe('getUserPosts', () => {
    it('should return posts created by user', async () => {
      const request = { user: { id: 1 } };
      const result = [
        { id: 1, title: 'testTitle1', content: 'testContent1' },
        { id: 2, title: 'testTitle2', content: 'testContent2' },
      ];

      mockUserService.getUserPosts.mockResolvedValue(result);
      const resultValue = await controller.getUserPosts(request);
      expect(result).toEqual(resultValue);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(request.user.id);
    });
  });
});
