import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  DuplicateEmailException,
  DuplicateUsernameException,
  UserNotFoundException,
  WrongPasswordException,
} from 'src/exceptions/exceptions';
import { AuthJwtPayload } from './types/jwtPayload';

describe('AuthService', () => {
  let service: AuthService;

  const mockedUserService = {
    getUserByEmailOrUsername: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserById: jest.fn(),
    saveUser: jest.fn(),
  };

  const mocketJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockedUserService },
        { provide: JwtService, useValue: mocketJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('register', () => {
    it('should register a new user and return the new user id', async () => {
      const registerDto = {
        username: 'testUsername',
        password: 'testPassword',
        email: 'testEmail@email.com',
      };

      const newUser = {
        id: 1,
        username: 'testUsername',
        password: 'hashedPassword',
        email: 'testEmail@email.com',
      };

      //duplicate user not found
      mockedUserService.getUserByEmailOrUsername.mockResolvedValue(null);

      const salt = 'salt';
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      mockedUserService.saveUser.mockResolvedValue(newUser);

      const result = await service.register(registerDto);

      expect(result).toEqual(newUser.id);
      expect(mockedUserService.getUserByEmailOrUsername).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.username,
      );
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', salt);
      expect(registerDto.password).toEqual('hashedPassword');

      expect(mockedUserService.saveUser).toHaveBeenCalledWith(registerDto);
    });
    it('should return DuplicateUsernameException', async () => {
      const registerDto = {
        username: 'testUsername',
        password: 'testPassword',
        email: 'testEmail123@email.com',
      };

      const duplicateUser = {
        id: 1,
        username: 'testUsername', //same username
        password: 'hashedPassword',
        email: 'testEmail@email.com',
      };

      //duplicate user found
      mockedUserService.getUserByEmailOrUsername.mockResolvedValue(
        duplicateUser,
      );

      await expect(service.register(registerDto)).rejects.toThrow(
        DuplicateUsernameException,
      );

      expect(mockedUserService.getUserByEmailOrUsername).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.username,
      );
    });
    it('should return DuplicateEmailException', async () => {
      const registerDto = {
        username: 'testUsername123',
        password: 'testPassword',
        email: 'testEmail@email.com',
      };

      const duplicateUser = {
        id: 1,
        username: 'testUsername',
        password: 'hashedPassword',
        email: 'testEmail@email.com', //same email
      };

      //duplicate user found
      mockedUserService.getUserByEmailOrUsername.mockResolvedValue(
        duplicateUser,
      );

      await expect(service.register(registerDto)).rejects.toThrow(
        DuplicateEmailException,
      );

      expect(mockedUserService.getUserByEmailOrUsername).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.username,
      );
    });
  });

  describe('validateUser', () => {
    it('should check for user password and return user id', async () => {
      const email = 'testEmail@email.com';
      const password = 'password';

      const user = {
        id: 1,
        username: 'testUsername',
        password: 'hashedPassword',
        email: 'testEmail@email.com',
      };

      //user found by email
      mockedUserService.getUserByEmail.mockResolvedValue(user);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validatUser(email, password);

      expect(result.id).toEqual(user.id);
      expect(mockedUserService.getUserByEmail).toHaveBeenCalledWith(email);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });
    it('should throw UserNotFoundException', async () => {
      const email = 'testEmail@email.com';
      const password = 'password';

      //user not found
      mockedUserService.getUserByEmail.mockResolvedValue(null);

      await expect(service.validatUser(email, password)).rejects.toThrow(
        UserNotFoundException,
      );

      expect(mockedUserService.getUserByEmail).toHaveBeenCalledWith(email);
    });
    it('should throw WrongPasswordException', async () => {
      const email = 'testEmail@email.com';
      const password = 'password';

      const user = {
        id: 1,
        username: 'testUsername',
        password: 'hashedPassword',
        email: 'testEmail@email.com',
      };

      //user found by email
      mockedUserService.getUserByEmail.mockResolvedValue(user);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validatUser(email, password)).rejects.toThrow(
        WrongPasswordException,
      );
      expect(mockedUserService.getUserByEmail).toHaveBeenCalledWith(email);
    });
  });
  describe('login', () => {
    it('should create and return new accessToken', () => {
      const userId = 1;
      const payload: AuthJwtPayload = { sub: userId };

      const newAccessToken = 'access-token';

      mocketJwtService.sign.mockReturnValue(newAccessToken);

      const result = service.login(userId);

      expect(result).toEqual(newAccessToken);
      expect(mocketJwtService.sign).toHaveBeenCalledWith(payload);
    });
  });
  describe('validateJwtUser', () => {
    it('should return the same userId as in the request', async () => {
      const userId = 1;

      const user = {
        id: 1,
        username: 'testUsername',
        password: 'hashedPassword',
        email: 'testEmail@email.com',
      };

      mockedUserService.getUserById.mockResolvedValue(user);

      const result = await service.validateJwtUser(userId);

      expect(result).toEqual(user.id);
      expect(mockedUserService.getUserById).toHaveBeenCalledWith(userId);
    });
    it('should return UserNotFoundException after receiving wrong userId', async () => {
      const userId = 999;

      mockedUserService.getUserById.mockResolvedValue(null);

      await expect(service.validateJwtUser(userId)).rejects.toThrow(
        UserNotFoundException,
      );

      expect(mockedUserService.getUserById).toHaveBeenCalledWith(userId);
    });
  });
});
