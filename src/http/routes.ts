import { FastifyInstance } from 'fastify';
import { registerController } from './controllers/register';
import { authenticateController } from './controllers/authenticate';
import { profileController } from './controllers/profile';
import { verifyJWT } from './middlewares/verify-jwt';

export async function appRoutes(app: FastifyInstance) {
  // Rotas públicas
  app.post('/users', registerController);
  app.post('/sessions', authenticateController);

  // Rotas que necessitam de autenticação
  app.get(
    '/me',
    {
      onRequest: [verifyJWT], // executa o middleware verifyJWT antes de executar o controller
    },
    profileController,
  );
}
