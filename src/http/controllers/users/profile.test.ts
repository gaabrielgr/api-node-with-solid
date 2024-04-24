import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('ProfileController (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list the profile that is authenticated', async () => {
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

    const token = responseAuthenticate.body.token;

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);

    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Joao',
        email: 'joao@gmail.com',
        created_at: expect.any(String),
      }),
    );
  });
});
