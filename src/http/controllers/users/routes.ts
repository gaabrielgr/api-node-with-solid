import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/http/middlewares/verify-jwt';

import { registerController } from './register';
import { authenticateController } from './authenticate';
import { profileController } from './profile';

export async function usersRoutes(app: FastifyInstance) {
  // Rotas públicas
  app.post('/users', registerController);
  app.post('/sessions', authenticateController);

  // Rotas que necessitam de autenticação
  app.get(
    '/me',
    {
      onRequest: [verifyJWT],
    },
    profileController,
  );
}
