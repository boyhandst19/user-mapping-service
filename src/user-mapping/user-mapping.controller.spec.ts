jest.mock('uuid', () => ({ v4: () => '4e31ab8e-3328-44b1-be33-f30c82f4bc32' }));
import { Test, TestingModule } from '@nestjs/testing';
import { UserMappingController } from './user-mapping.controller';
import { UserMappingService } from './user-mapping.service';
import { BadRequestException } from '@nestjs/common';

const mockUserMappingService = () => ({
  findOrCreateUserMapping: jest.fn(),
});

describe('UserMappingController', () => {
  let controller: UserMappingController;
  let service: ReturnType<typeof mockUserMappingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserMappingController],
      providers: [
        {
          provide: UserMappingService,
          useFactory: mockUserMappingService,
        },
      ],
    }).compile();

    controller = module.get<UserMappingController>(UserMappingController);
    service = module.get(UserMappingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service and return userID', async () => {
    service.findOrCreateUserMapping.mockResolvedValue({ userID: 'mock-uuid' });
    const dto = { id1: 'foo', id2: 'bar' };
    const result = await controller.createOrGetUserMapping(dto);
    expect(result).toEqual({ userID: 'mock-uuid' });
    expect(service.findOrCreateUserMapping).toHaveBeenCalledWith('foo', 'bar');
  });

  it('should return undefined for invalid DTO', async () => {
    const invalidDto = { id1: '', id2: '' };
    await expect(controller.createOrGetUserMapping(invalidDto)).resolves.toBe(undefined);
  });
});
