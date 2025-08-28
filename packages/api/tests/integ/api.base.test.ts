import { describe, expect, test } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { Server } from 'http';
import { runApp } from '../../src/app';

let server: Server;
const app = express();

beforeAll(() => {
  server = runApp(app, 5001);
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
