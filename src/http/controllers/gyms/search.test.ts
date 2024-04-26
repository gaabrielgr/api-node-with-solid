import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gym Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gym', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia ReactJS',
        description: 'Descrição teste',
        phone: '51999999999',
        latitude: -30.05665,
        longitude: -51.18736,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia NodeJS',
        description: 'Descrição teste',
        phone: '51999999999',
        latitude: -30.05665,
        longitude: -51.18736,
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ query: 'ReactJS' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Academia ReactJS' }),
    ]);
  });
});
