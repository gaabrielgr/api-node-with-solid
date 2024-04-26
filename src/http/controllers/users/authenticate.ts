import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { InvalidCredentialsError } from '@/uses-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/uses-cases/factories/make-authenticate-use-case';

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
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    const token = await response.jwtSign(
      {
        role: user.role,
      },
      { sign: { sub: user.id } },
    );

    const refreshToken = await response.jwtSign(
      {
        role: user.role,
      },
      { sign: { sub: user.id, expiresIn: '7d' } },
    );

    return response
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return response.status(400).send({ message: error.message });
    }
    throw error;
  }
}
