import { makeCheckInUseCase } from '@/uses-cases/factories/make-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, response: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInsParamsSchema.parse(request.params);
  const { latitude, longitude } = createBodySchema.parse(request.body);
  const userId = request.user.sub;

  const checkInUseCase = makeCheckInUseCase();

  const { checkIn } = await checkInUseCase.execute({
    userId,
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return response.status(200).send(checkIn);
}
