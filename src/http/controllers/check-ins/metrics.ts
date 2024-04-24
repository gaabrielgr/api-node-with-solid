import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserMetricsUseCase } from '@/uses-cases/factories/make-get-user-metrics-use-case';

export async function metrics(request: FastifyRequest, response: FastifyReply) {
  const userId = request.user.sub;

  const fetchUserCheckInsHistoryUseCase = makeGetUserMetricsUseCase();

  const { checkInsCount } = await fetchUserCheckInsHistoryUseCase.execute({
    userId,
  });

  return response.status(200).send({
    checkInsCount,
  });
}
