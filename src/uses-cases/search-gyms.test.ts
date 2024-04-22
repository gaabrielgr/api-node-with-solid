/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, beforeEach, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('SearchGymsUseCase', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for a gym', async () => {
    await gymsRepository.create({
      title: 'gym-title-01',
      description: 'gym-description-01',
      latitude: -30.05665,
      longitude: -51.18736,
    });

    await gymsRepository.create({
      title: 'gym-title-02',
      description: 'gym-description-02',
      latitude: -30.05665,
      longitude: -51.18736,
    });

    const { gyms } = await sut.execute({
      query: 'gym-title',
      page: 1,
    });

    expect(gyms).toHaveLength(2);
  });

  it('should be able to search for a paginated gym', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `gym-title-${i}`,
        description: `gym-description-${i}`,
        latitude: -30.05665,
        longitude: -51.18736,
      });
    }

    const { gyms } = await sut.execute({
      query: 'gym-title',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-title-21' }),
      expect.objectContaining({ title: 'gym-title-22' }),
    ]);
  });
});
