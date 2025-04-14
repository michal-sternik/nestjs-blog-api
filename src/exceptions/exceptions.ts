import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateUsernameException extends HttpException {
  constructor(username: string) {
    super(
      `User with username: ${username} already exists.`,
      HttpStatus.CONFLICT,
    );
  }
}

export class DuplicateEmailException extends HttpException {
  constructor(email: string) {
    super(`User with email: ${email} already exists.`, HttpStatus.CONFLICT);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(prop: string) {
    super(`User with: '${prop}' not found.`, HttpStatus.NOT_FOUND);
  }
}

export class WrongPasswordException extends HttpException {
  constructor() {
    super('Wrong password provided', HttpStatus.UNAUTHORIZED);
  }
}
