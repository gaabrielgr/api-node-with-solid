import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role: 'ADMIN' | 'USER' = 'USER',
) {
  await prisma.user.create({
    data: {
      name: 'Gabriel',
      email: 'gabriel@gmail.com',
      password_hash: await hash('123456', 6),
      role,
    },
  });

  const responseAuthenticate = await request(app.server)
    .post('/sessions')
    .send({
      email: 'gabriel@gmail.com',
      password: '123456',
    });

  const { token } = responseAuthenticate.body;

  return { token };
}
