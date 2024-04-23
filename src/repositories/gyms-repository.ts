import { Gym, Prisma } from '@prisma/client';

export interface FindManyNearbyParams {
  latitude: number; // Latitude do usuário
  longitude: number; // Longitude do usuário
}
export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
}
