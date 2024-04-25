import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Metrics Check ins Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get metrics of check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();
    const gym = await prisma.gym.create({
      data: {
        title: 'Academia NodeJS',
        description: 'description.',
        phone: '1199999999',
        latitude: -30.05477,
        longitude: -51.18268,
        id: 'id-teste',
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          user_id: user.id,
          gym_id: gym.id,
        },
        {
          user_id: user.id,
          gym_id: gym.id,
        },
      ],
    });

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.checkInsCount).toEqual(2);
  });
});
