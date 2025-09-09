import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import { Server } from 'http';
import { createApp } from '../../src/app';
import { Logger } from '../../src/core/ports/services/logger.service';
import container from '../../src/infrastructure/config/inversify';
import { TYPE } from '../../src/infrastructure/config/inversify-type';

const logger = container.get<Logger>(TYPE.Logger);

let server: Server;
const app = createApp();
const PORT = 5001;

beforeAll(() => {
  server = app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
  });
});

afterAll((done) => {
  server.close(done);
});

describe('setup integ tests', () => {
  test('GET /api/v1', async () => {
    const response = await request(app).get('/api/v1');
    expect(response.statusCode).toBe(200);
  });
});
