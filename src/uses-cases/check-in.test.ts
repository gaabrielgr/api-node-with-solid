/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, beforeEach, expect, it } from 'vitest';
import { CheckinUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckinUseCase;

describe('CheckinUseCase', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckinUseCase(checkInsRepository);
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user_id',
      gymId: 'gym_id',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
