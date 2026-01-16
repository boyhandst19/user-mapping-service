import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { UserMappingService } from '../src/user-mapping/user-mapping.service';
import { UserMappingController } from '../src/user-mapping/user-mapping.controller';

jest.mock('../src/utils/uuid.util', () => ({
  generateUUID: jest.fn(() => '550e8400-e29b-41d4-a716-446655440000'),
}));

// Mock UserMappingService
const mockUserMappingService = {
  findOrCreateUserMapping: jest.fn(async (id1, id2) => {
    // Simple in-memory mock logic
    if (!mockUserMappingService._store) mockUserMappingService._store = {};
    const key = `${id1}:${id2}`;
    if (!mockUserMappingService._store[key]) {
      mockUserMappingService._store[key] = { userID: '550e8400-e29b-41d4-a716-446655440000' };
    }
    return mockUserMappingService._store[key];
  }),
  _store: {},
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserMappingController],
      providers: [
        { provide: UserMappingService, useValue: mockUserMappingService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  it('/api/user-mapping (POST) - creates new mapping', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/user-mapping')
      .send({ id1: 'test_id1', id2: 'test_id2' })
      .expect(201);
    expect(response.body).toHaveProperty('userID');
    expect(typeof response.body.userID).toBe('string');
  });

  it('/api/user-mapping (POST) - returns existing mapping', async () => {
    // First, create the mapping
    const first = await request(app.getHttpServer())
      .post('/api/user-mapping')
      .send({ id1: 'test_id3', id2: 'test_id4' })
      .expect(201);
    const userID = first.body.userID;
    // Second, send the same ids and expect the same userID
    const second = await request(app.getHttpServer())
      .post('/api/user-mapping')
      .send({ id1: 'test_id3', id2: 'test_id4' })
      .expect(201);
    expect(second.body.userID).toBe(userID);
  });
});
