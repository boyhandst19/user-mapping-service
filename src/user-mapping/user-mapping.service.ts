
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMapping } from './user-mapping.entity';
import { generateUUID } from '../utils/uuid.util';
import { RedisCacheService } from './redis.cache';

@Injectable()
export class UserMappingService {
  constructor(
    @InjectRepository(UserMapping)
    private userMappingRepository: Repository<UserMapping>,
    private readonly redisCache: RedisCacheService,
  ) {}

  async findOrCreateUserMapping(
    id1: string,
    id2: string,
  ): Promise<{ userID: string }> {
    const cacheKey = `user-mapping:${id1}:${id2}`;
    // 1. Check Redis cache first
    const cachedUserID = await this.redisCache.get(cacheKey);
    if (cachedUserID) {
      return { userID: cachedUserID };
    }

    // 2. Check DB for mapping
    const existingMapping = await this.userMappingRepository.findOne({
      where: [
        { id1, id2 },
        { id1: id2, id2: id1 },
      ],
    });
    if (existingMapping) {
      // Cache result in Redis
      await this.redisCache.set(cacheKey, existingMapping.userID);
      return { userID: existingMapping.userID };
    }

    // 3. Generate new UUID
    const userID = generateUUID();
    // Save to DB
    const newMapping = this.userMappingRepository.create({ id1, id2, userID });
    await this.userMappingRepository.save(newMapping);
    // Cache new mapping
    await this.redisCache.set(cacheKey, userID);
    return { userID };
  }
}
