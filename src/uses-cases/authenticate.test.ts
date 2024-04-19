/* eslint-disable @typescript-eslint/no-unused-vars */
import { it, describe, expect, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
// sut -> Signifca System Under Test, ou seja, o sistema que está sendo testado, no caso, o authenticateUseCase

describe('AuthenticateUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'autenticado',
      email: 'autenticado@gmail.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'autenticado@gmail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'email-nao-cadastrado@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'autenticado',
      email: 'autenticado@gmail.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'autenticado@gmail.com',
        password: 'senha-errada',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
