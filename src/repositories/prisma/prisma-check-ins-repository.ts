/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckIn, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CheckInsRepository } from '../check-ins-repository';
import dayjs from 'dayjs';
import { i } from 'vitest/dist/reporters-LqC_WI4d';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        created_at: 'desc',
      },
    });

    return checkIns;
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return count;
  }

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

    /* Explicação do código acima:
      Estamos buscando um checkin que tenha sido feito por um usuário específico
      e a sua data de criação seja maior ou igual ao início do dia(startOfTheDay) e menor ou igual ao fim do dia(endOfTheDay).
      O método findFirst retorna o primeiro registro que encontrar e se não encontrar nenhum registro, retorna null.

      gt -> maior que
      lt -> menor que
      gte -> maior ou igual a
      lte -> menor ou igual a
    */
    return checkIn;
  }

  create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = prisma.checkIn.create({
      data,
    });

    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    });

    return updatedCheckIn;
  }
}
