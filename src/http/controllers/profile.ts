import { makeGetUserProfileUseCase } from '@/uses-cases/factories/make-get-user-profile-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function profileController(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const getUserProfile = makeGetUserProfileUseCase();
  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
    // request.user.sub -> Para funcionar é preciso do jwtVerify arquivo verifyJWT, que vai adicionar o user no request e o sub é o id do usuário que está no token
  });

  return response.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
