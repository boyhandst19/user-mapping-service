jest.mock('uuid', () => ({ v4: () => '4e31ab8e-3328-44b1-be33-f30c82f4bc32' }));
import { Test, TestingModule } from '@nestjs/testing';
import { UserMappingService } from './user-mapping.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMapping } from './user-mapping.entity';
import { RedisCacheService } from './redis.cache';

const mockUserMappingRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockRedisCacheService = () => ({
  get: jest.fn(),
  set: jest.fn(),
});

describe('UserMappingService', () => {
  let service: UserMappingService;
  let repo: ReturnType<typeof mockUserMappingRepository>;
  let redis: ReturnType<typeof mockRedisCacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMappingService,
        {
          provide: getRepositoryToken(UserMapping),
          useFactory: mockUserMappingRepository,
        },
        {
          provide: RedisCacheService,
          useFactory: mockRedisCacheService,
        },
      ],
    }).compile();

    service = module.get<UserMappingService>(UserMappingService);
    repo = module.get(getRepositoryToken(UserMapping));
    redis = module.get(RedisCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return userID from cache if present', async () => {
    redis.get.mockResolvedValue('cached-uuid');
    const result = await service.findOrCreateUserMapping('id1', 'id2');
    expect(result).toEqual({ userID: 'cached-uuid' });
    expect(redis.get).toHaveBeenCalledWith('user-mapping:id1:id2');
    expect(repo.findOne).not.toHaveBeenCalled();
  });

  it('should return userID from DB if not in cache', async () => {
    redis.get.mockResolvedValue(null);
    repo.findOne.mockResolvedValue({ userID: 'db-uuid' });
    const result = await service.findOrCreateUserMapping('id1', 'id2');
    expect(result).toEqual({ userID: 'db-uuid' });
    expect(repo.findOne).toHaveBeenCalledWith({ where: [ { id1: 'id1', id2: 'id2' }, { id1: 'id2', id2: 'id1' } ] });
    expect(redis.set).toHaveBeenCalledWith('user-mapping:id1:id2', 'db-uuid');
  });

  it('should create and return new userID if not in cache or DB', async () => {
    redis.get.mockResolvedValue(null);
    repo.findOne.mockResolvedValue(undefined);
    repo.create.mockImplementation((dto) => dto);
    repo.save.mockImplementation(async (entity) => entity);
    redis.set.mockResolvedValue(undefined);
    const result = await service.findOrCreateUserMapping('idA', 'idB');
    expect(result.userID).toMatch(/[0-9a-fA-F-]{36}/);
    expect(repo.create).toHaveBeenCalledWith({ id1: 'idA', id2: 'idB', userID: expect.any(String) });
    expect(repo.save).toHaveBeenCalled();
    expect(redis.set).toHaveBeenCalledWith('user-mapping:idA:idB', result.userID);
  });

  it('should check both id1/id2 and id2/id1 in DB lookup', async () => {
    redis.get.mockResolvedValue(null);
    repo.findOne.mockResolvedValue({ userID: 'db-uuid' });
    await service.findOrCreateUserMapping('foo', 'bar');
    expect(repo.findOne).toHaveBeenCalledWith({ where: [ { id1: 'foo', id2: 'bar' }, { id1: 'bar', id2: 'foo' } ] });
  });
});
