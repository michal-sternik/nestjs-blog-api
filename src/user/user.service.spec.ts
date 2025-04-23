import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserNotFoundException } from 'src/exceptions/exceptions';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getUserByEmail', () => {
    it('should return a user after receiving valid email', async () => {
      const email = 'testEmail@email.com';
      const returnedUser = {
        id: 1,
        username: 'testUser',
        email: 'testEmail@email.com',
      };
      mockUserRepository.findOne.mockResolvedValue(returnedUser);
      const result = await service.getUserByEmail(email);
      expect(result).toEqual(returnedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });
  describe('getUserById', () => {
    it('should return a user with its posts after receiving valid id', async () => {
      const id = 1;
      const returnedUser = {
        id: 1,
        username: 'testUser',
        email: 'testEmail@email.com',
        posts: [
          { id: 1, title: 'testTitle1', content: 'testContent1' },
          { id: 2, title: 'testTitle2', content: 'testContent2' },
        ],
      };
      mockUserRepository.findOne.mockResolvedValue(returnedUser);
      const result = await service.getUserById(id);
      expect(result).toEqual(returnedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: id },
        relations: ['posts'],
      });
    });
  });
  describe('getUserByIdWithoutPosts', () => {
    it('should return a user without posts after receiving valid id', async () => {
      const id = 1;
      const returnedUser = {
        id: 1,
        username: 'testUser',
        email: 'testEmail@email.com',
      };
      mockUserRepository.findOne.mockResolvedValue(returnedUser);
      const result = await service.getUserByIdWithoutPosts(id);
      expect(result).toEqual(returnedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: id },
      });
    });
  });
  describe('getUserByEmailOrUsername', () => {
    it('should return a user without posts after receiving valid email and invalid username', async () => {
      const email = 'testEmail@email.com';
      const username = '';
      const returnedUser = {
        id: 1,
        username: 'testUser',
        email: 'testEmail@email.com',
      };
      mockUserRepository.findOne.mockResolvedValue(returnedUser);
      const result = await service.getUserByEmailOrUsername(email, username);
      expect(result).toEqual(returnedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: username }, { email: email }],
      });
    });
    it('should return a user without posts after receiving valid username and invalid email', async () => {
      const email = '';
      const username = 'testUser';
      const returnedUser = {
        id: 1,
        username: 'testUser',
        email: 'testEmail@email.com',
      };
      mockUserRepository.findOne.mockResolvedValue(returnedUser);
      const result = await service.getUserByEmailOrUsername(email, username);
      expect(result).toEqual(returnedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: username }, { email: email }],
      });
    });
    it('should return a user without posts after receiving valid username and valid email', async () => {
      const email = 'testEmail@email.com';
      const username = 'testUser';
      const returnedUser = {
        id: 1,
        username: 'testUser',
        email: 'testEmail@email.com',
      };
      mockUserRepository.findOne.mockResolvedValue(returnedUser);
      const result = await service.getUserByEmailOrUsername(email, username);
      expect(result).toEqual(returnedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: username }, { email: email }],
      });
    });
    it('should return null if no user matches the given email or username', async () => {
      const email = 'nonexistent@email.com';
      const username = 'nonexistentUser';
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserByEmailOrUsername(email, username);

      expect(result).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: [{ username }, { email }],
      });
    });
  });
  describe('saveUser', () => {
    it('should return a user after saving it in the database', async () => {
      const newUser = {
        username: 'testUser',
        email: 'testEmail@email.com',
        password: 'unhashedPassword',
      };
      const returnedUser = {
        id: 1,
        username: 'testUser',
        email: 'testEmail@email.com',
        password: 'hashedPassword',
      };
      mockUserRepository.create.mockReturnValue(returnedUser);
      mockUserRepository.save.mockResolvedValue(returnedUser);

      const result = await service.saveUser(newUser);
      expect(result).toEqual(returnedUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(returnedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(newUser);
    });
  });
  describe('getUserPosts', () => {
    it('should return a list of user posts after receiving valid user id', async () => {
      const userId = 1;
      const returnedUser = {
        id: 1,
        username: 'testUser',
        email: 'testEmail@email.com',
        posts: [
          { id: 1, title: 'testTitle1', content: 'testContent1' },
          { id: 2, title: 'testTitle2', content: 'testContent2' },
        ],
      };
      mockUserRepository.findOne.mockResolvedValue(returnedUser);

      const result = await service.getUserPosts(userId);
      expect(result).toEqual(returnedUser.posts);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['posts'],
      });
    });

    it('should throw UserNotFoundException if user is not found', async () => {
      const userId = 999; //nieistniejący ID
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserPosts(userId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['posts'],
      });
    });
  });
});
