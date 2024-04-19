import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CheckInsRepository } from '../check-ins-repository';

export class PrismaCheckInsRepository implements CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = prisma.checkIn.create({
      data,
    });

    return checkIn;
  }
}
