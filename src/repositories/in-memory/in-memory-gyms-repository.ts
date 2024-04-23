import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from 'crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude, // Latitude do usuário
          longitude: params.longitude, // Longitude do usuário
        },
        {
          latitude: item.latitude.toNumber(), // Latitude do estabelecimento
          longitude: item.longitude.toNumber(), // Longitude do estabelecimento
        },
      );
      const MAX_DISTANCE_IN_KILOMETERS = 10; // 10km

      return distance <= MAX_DISTANCE_IN_KILOMETERS;
    });
  }

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) return null;

    return gym;
  }

  async searchMany(query: string, page: number) {
    const MAX_ITEMS_PER_PAGE = 20;

    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE);
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.items.push(gym);

    return gym;
  }
}
