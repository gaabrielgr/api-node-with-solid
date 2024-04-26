import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('ProfileController (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list the profile that is authenticated', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);

    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Gabriel',
        email: 'gabriel@gmail.com',
        created_at: expect.any(String),
      }),
    );
  });
});
