import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Menos de 10 km de distância',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -30.05477,
        longitude: -51.18268,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Mais de 10km de distância',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -29.91991,
        longitude: -51.02458,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -30.06552,
        longitude: -51.19001,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Menos de 10 km de distância',
      }),
    ]);
  });
});
