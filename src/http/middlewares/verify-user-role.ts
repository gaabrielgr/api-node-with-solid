import { FastifyReply, FastifyRequest } from 'fastify';

export function verifyUserRole(roleToVerify: 'ADMIN' | 'USER') {
  return async (request: FastifyRequest, response: FastifyReply) => {
    const { role } = request.user;

    if (role !== roleToVerify) {
      return response.status(403).send({ message: 'Acesso negado' });
    }
  };
}
