import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../../src/config/supabase.js', async () => import('../setup/mockSupabase.js'));

const { resetMockSupabase, setMockRole } = await import('../setup/mockSupabase.js');
const { default: app } = await import('../../src/app.js');

describe('products integration', () => {
  beforeEach(() => resetMockSupabase());

  test('GET /api/products sin token responde 401', async () => {
    const response = await request(app).get('/api/products');

    expect(response.status).toBe(401);
  });

  test('POST /api/products sin token responde 401', async () => {
    const response = await request(app).post('/api/products').send({});

    expect(response.status).toBe(401);
  });

  test('POST /api/products con rol customer responde 403', async () => {
    setMockRole('customer');
    const response = await request(app).post('/api/products').set('Authorization', 'Bearer token').send({});

    expect(response.status).toBe(403);
  });

  test('GET /api/products con token mock valido responde 200', async () => {
    setMockRole('customer');
    const response = await request(app).get('/api/products').set('Authorization', 'Bearer token');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});
