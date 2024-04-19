/* eslint-disable @typescript-eslint/no-unused-vars */
import { it, describe, expect, beforeEach, afterEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('RegisterUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123456',
    });

    const isPassworddCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    );

    expect(isPassworddCorrectlyHashed).toBe(true);
  });

  it('should not be able to register a user with an existing email', async () => {
    const email = 'teste@gmail.com';

    await sut.execute({
      name: 'teste',
      email,
      password: '123456',
    });

    await expect(() =>
      sut.execute({
        name: 'teste',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
