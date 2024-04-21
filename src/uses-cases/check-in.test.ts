/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, beforeEach, expect, it, vi, afterEach } from 'vitest';
import { CheckinUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckinUseCase;

describe('CheckinUseCase', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckinUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-id-01',
      title: 'Academia Node',
      description: 'Academia de programação',
      phone: '51999999999',
      latitude: -30.065517,
      longitude: -51.190007,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    gymsRepository.items = [];
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id-01',
      gymId: 'gym-id-01',
      userLatitude: -30.065517,
      userLongitude: -51.190007,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 3, 13, 10, 0, 0));

    await sut.execute({
      userId: 'user-id-01',
      gymId: 'gym-id-01',
      userLatitude: -30.065517,
      userLongitude: -51.190007,
    });

    await expect(() =>
      sut.execute({
        userId: 'user-id-01',
        gymId: 'gym-id-01',
        userLatitude: -30.065517,
        userLongitude: -51.190007,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should  be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 3, 13, 10, 0, 0));

    await sut.execute({
      userId: 'user-id-01',
      gymId: 'gym-id-01',
      userLatitude: -30.065517,
      userLongitude: -51.190007,
    });

    vi.setSystemTime(new Date(2024, 3, 14, 10, 0, 0));

    const { checkIn } = await sut.execute({
      userId: 'user-id-01',
      gymId: 'gym-id-01',
      userLatitude: -30.065517,
      userLongitude: -51.190007,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-id-02',
      title: 'Academia Node',
      description: 'Academia de programação',
      phone: '51999999999',
      latitude: new Decimal(-30.05665),
      longitude: new Decimal(-51.18736),
    });

    expect(() =>
      sut.execute({
        userId: 'user-id-01',
        gymId: 'gym-id-02',
        userLatitude: -30.065517,
        userLongitude: -51.190007,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
