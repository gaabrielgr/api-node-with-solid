/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, beforeEach, expect, it, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('ValidateCheckInUseCase', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-id-01',
      gym_id: 'gym-id-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate a check-in that does not exist', async () => {
    await expect(
      sut.execute({
        checkInId: 'invalid-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40, 0)); // no Brasil(utc -3) 01/01/2024 10:40:00

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-id-01',
      gym_id: 'gym-id-01',
    });
    const TWENTY_ONE_MINUTES_IN_MILLISECONDS = 21 * 60 * 1000;

    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MILLISECONDS); // vai avançar 21 minutos no tempo

    await expect(
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
