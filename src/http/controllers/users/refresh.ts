import { FastifyReply, FastifyRequest } from 'fastify';

export async function refreshController(
  request: FastifyRequest,
  response: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true });

  const token = await response.jwtSign(
    { role: request.user.role },
    { sign: { sub: request.user.sub } },
  );
  const refreshToken = await response.jwtSign(
    { role: request.user.role },
    { sign: { sub: request.user.sub, expiresIn: '7d' } },
  );

  return response
    .setCookie('refreshToken', refreshToken, {
      path: '/', // serve para garantir que o cookie seja enviado em todas as rotas
      secure: true, // serve para garantir que o cookie só será enviado em conexões HTTPS
      sameSite: true, // serve para proteger o cookie contra ataques CSRF
      httpOnly: true, // serve para garantir que o cookie não seja acessível via JavaScript
    })
    .status(200)
    .send({ token });
}
