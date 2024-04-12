import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterServiceRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const password_hash = await hash(password, 6);

    const userWitchSameEmail = await this.usersRepository.findByEmail(email);

    if (userWitchSameEmail) {
      throw new UserAlreadyExistsError();
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}

// O serviço é responsável por realizar a lógica de negócio da aplicação e chamar os métodos do repositório para realizar as operações no banco de dados. Neste caso, o serviço RegisterService é responsável por realizar o cadastro de um novo usuário na aplicação. Ele recebe os dados do usuário, criptografa a senha e verifica se já existe um usuário com o mesmo e-mail cadastrado. Caso não exista, ele chama o método create do repositório para criar o novo usuário no banco de dados.
