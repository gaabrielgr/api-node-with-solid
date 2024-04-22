/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, beforeEach, expect, it } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe('GetUserMetricsUseCase', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('should be able to get check-ins count from metrics', async () => {
    // Cria um check-in
    await checkInsRepository.create({
      user_id: 'user-id-01',
      gym_id: 'gym-id-01',
    });

    // Cria outro check-in
    await checkInsRepository.create({
      user_id: 'user-id-01',
      gym_id: 'gym-id-02',
    });
    const { checkInsCount } = await sut.execute({
      userId: 'user-id-01',
    });

    expect(checkInsCount).toEqual(2);
  });
});
