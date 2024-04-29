import fastify from 'fastify';
import { usersRoutes } from './http/controllers/users/routes';
import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { checkInsRoutes } from './http/controllers/check-ins/routes';
import fastifyCookie from '@fastify/cookie';
export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: { expiresIn: '10m' },
});
// teste
app.register(fastifyCookie);
app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, response) => {
  if (error instanceof ZodError) {
    return response
      .status(400)
      .send({ message: 'Erro de validação', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return response.status(500).send({ message: 'Erro interno do servidor' });
});
