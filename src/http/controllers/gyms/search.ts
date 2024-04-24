import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeSearchGymsUseCase } from '@/uses-cases/factories/make-search-gyms-use-case';

export async function search(request: FastifyRequest, response: FastifyReply) {
  const searchGymsBodySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymsBodySchema.parse(request.query);

  const searchGymsUseCase = makeSearchGymsUseCase();

  const { gyms } = await searchGymsUseCase.execute({
    query,
    page,
  });

  return response.status(200).send({
    gyms,
  });
}
