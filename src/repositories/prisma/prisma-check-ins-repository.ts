/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CheckInsRepository } from '../check-ins-repository';
import dayjs from 'dayjs';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date').toDate();
    const endOfTheDay = dayjs(date).endOf('date').toDate();

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay, // Maior ou igual ao início do dia
          lte: endOfTheDay, // Menor ou igual ao fim do dia
        },
      },
    });

    return checkIn;
  }

  create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = prisma.checkIn.create({
      data,
    });

    return checkIn;
  }
}
