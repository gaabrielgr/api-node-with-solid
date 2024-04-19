import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { AuthenticateUseCase } from '../../uses-cases/authenticate';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { InvalidCredentialsError } from '@/uses-cases/errors/invalid-credentials-error';

export async function authenticateController(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return response.status(400).send({ message: error.message });
    }
    throw error;
  }

  return response.status(200).send();
}