/* eslint-disable @typescript-eslint/no-unused-vars */
import { it, describe, beforeEach, expect } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;
// sut -> Signifca System Under Test, ou seja, o sistema que está sendo testado, no caso, o authenticateUseCase

describe('GetUserProfile ', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'autenticado',
      email: 'autenticado@gmail.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual('autenticado');
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
