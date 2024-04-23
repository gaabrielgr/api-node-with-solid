/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-repository';
import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findById(id: string) {
    const checkIn = this.items.find((checkIn) => checkIn.id === id);

    if (!checkIn) {
      return null;
    }
    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      // checkInDate.isAfter(startOfTheDay) -> verifica se a data do checkIn é depois do início do dia
      // checkInDate.isBefore(endOfTheDay) -> verifica se a data do checkIn é antes do fim do dia

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkOnSameDate) {
      return null;
    }
    return checkOnSameDate;
  }

  async countByUserId(userId: string) {
    const checkInsCount = this.items.filter(
      (checkIn) => checkIn.user_id === userId,
    ).length;

    return checkInsCount;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);
    // findIndex retorna o índice do primeiro elemento de um array que satisfaça a função de teste fornecida.
    // Caso contrário, ele retorna -1, indicando que nenhum elemento passou no teste.

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
