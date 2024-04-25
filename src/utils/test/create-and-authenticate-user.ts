import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Joao',
    email: 'joao@gmail.com',
    password: '123456',
  });

  const responseAuthenticate = await request(app.server)
    .post('/sessions')
    .send({
      email: 'joao@gmail.com',
      password: '123456',
    });

  const { token } = responseAuthenticate.body;

  return { token };
}
