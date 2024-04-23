import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { Environment } from 'vitest';
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateDataBaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Por favor defina a variável de ambiente DATABASE_URL');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // Acontece antes dos meus testes executarem
    const schema = randomUUID();
    const databaseURL = generateDataBaseURL(schema);

    process.env.DATABASE_URL = databaseURL;

    execSync(`npx prisma migrate deploy`);

    /* 
    Devemos usar npx prisma migrate deploy 
    o npx prisma migrate dev vai criar um banco de dados novo a cada vez que rodarmos os testes, o que não é o comportamento que queremos.
    O deploy pula a etapa de verificação de se o banco de dados já existe, então ele não vai criar um novo banco de dados a cada vez que rodarmos os testes.
    */

    return {
      async teardown() {
        // depois dos meus testes executarem

        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );

        await prisma.$disconnect();
      },
    };
  },
};

/* 
Ao rodar npm link dentro da pasta vitest-environment-prisma, o comando npm link vitest-environment-prisma é executado, criando um link simbólico para a pasta node_modules do projeto principal.
Então quando voltamos para pasta principal e rodamos npm link vitest-environment-prisma, o comando npm link vitest-environment-prisma é executado, criando um link simbólico para a pasta node_modules do projeto vitest-environment-prisma.
Dessa forma teremos um link simbólico entre as duas pastas, permitindo que o ambiente de testes do Prisma seja compartilhado entre os dois projetos.

*/
