import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { RegisterService } from '../../services/register.service';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error';

export async function registerController(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerService = new RegisterService(usersRepository);

    await registerService.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return response.status(409).send({ message: error.message });
    }
    throw error;
  }

  return response.status(201).send();
}

// A controller é responsável por receber a requisição HTTP, validar os dados recebidos, chamar o serviço responsável pela lógica de negócio e retornar a resposta adequada para o cliente. Neste caso, a controller registerController é responsável por receber os dados de cadastro de um novo usuário, validar esses dados, chamar o serviço RegisterService para realizar o cadastro e retornar a resposta adequada para o cliente. Caso ocorra algum erro durante o cadastro, a controller retorna o status 409 (Conflict). Caso o cadastro seja realizado com sucesso, a controller retorna o status 201 (Created).
