import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchUserCheckInsHistoryUseCase } from '@/uses-cases/factories/make-fetch-user-check-ins-history-use-case';

export async function history(request: FastifyRequest, response: FastifyReply) {
  const checkInsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInsHistoryQuerySchema.parse(request.query);
  const userId = request.user.sub;

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId,
    page,
  });

  return response.status(200).send({
    checkIns,
  });
}
