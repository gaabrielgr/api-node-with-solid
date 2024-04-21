import { it, describe, expect, beforeEach } from 'vitest';
import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('CreateGymUseCase', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia de bla bla bla',
      description: 'Descrição bla bla bla',
      phone: '51999999999',
      latitude: -30.05665,
      longitude: -51.18736,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
