export class UserAlreadyExistsError extends Error {
  constructor() {
    super('E-mail já cadastrado!');
    this.name = 'UserAlreadyExistsError';
  }
}
