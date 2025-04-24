import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockedAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockedAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('registers user and returns new user id', async () => {
      const registerDto = {
        username: 'testUsername',
        password: 'testPassword',
        email: 'testEmail@email.com',
      };
      const newUserId = 1;

      mockedAuthService.register.mockResolvedValue(newUserId);

      const result = await controller.register(registerDto);

      expect(result).toEqual(newUserId);
      expect(mockedAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });
  describe('login', () => {
    it('logs in user and returns new access token', () => {
      const request = { user: { id: 1 } };
      const accessToken = 'access-token';

      mockedAuthService.login.mockReturnValue(accessToken);

      const result = controller.login(request);

      expect(result).toEqual(accessToken);
      expect(mockedAuthService.login).toHaveBeenCalledWith(request.user.id);
    });
  });
});
