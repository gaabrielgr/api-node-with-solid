/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, beforeEach, expect, it, vi, afterEach } from 'vitest';
import { CheckinUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckinUseCase;

describe('CheckinUseCase', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckinUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user_id',
      gymId: 'gym_id',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 3, 13, 10, 0, 0));

    await sut.execute({
      userId: 'user_id',
      gymId: 'gym_id',
    });

    await expect(() =>
      sut.execute({
        userId: 'user_id',
        gymId: 'gym_id',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should  be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 3, 13, 10, 0, 0));

    await sut.execute({
      userId: 'user_id',
      gymId: 'gym_id',
    });

    vi.setSystemTime(new Date(2024, 3, 14, 10, 0, 0));

    const { checkIn } = await sut.execute({
      userId: 'user_id',
      gymId: 'gym_id',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
