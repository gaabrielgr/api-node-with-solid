/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, beforeEach, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('FetchNearbyGymsUseCaseUseCase', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('it should be able to fetch for nearby gyms within a maximum distance of 10km', async () => {
    await gymsRepository.create({
      title: 'Menos de 10km de distância',
      description: 'perto',
      latitude: -30.05477,
      longitude: -51.18268,
    });

    await gymsRepository.create({
      title: 'Mais de 10km de distância',
      description: 'longe',
      latitude: -29.91991,
      longitude: -51.02458,
    });

    const { gyms } = await sut.execute({
      userLatitude: -30.06552,
      userLongitude: -51.19001,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Menos de 10km de distância' }),
    ]);
  });
});
