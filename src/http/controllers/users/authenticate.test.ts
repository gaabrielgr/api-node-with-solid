import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('AuthenticateController (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'Joao',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'joao@gmail.com',
      password: '123456',
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    );
  });
});
