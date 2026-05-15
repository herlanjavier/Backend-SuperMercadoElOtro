import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../../src/config/supabase.js', async () => import('../setup/mockSupabase.js'));

const { default: app } = await import('../../src/app.js');

describe('auth integration', () => {
  test('POST /api/auth/login con body invalido responde 400', async () => {
    const response = await request(app).post('/api/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  test('POST /api/auth/register-customer con email invalido responde 400', async () => {
    const response = await request(app).post('/api/auth/register-customer').send({
      email: 'bad',
      password: 'Password123',
      firstName: 'Juan',
      lastName: 'Perez',
    });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  test('GET /api/auth/me sin token responde 401', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.ok).toBe(false);
  });
});
