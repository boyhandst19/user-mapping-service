
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapping } from './user-mapping.entity';
import { UserMappingService } from './user-mapping.service';
import { UserMappingController } from './user-mapping.controller';
import { RedisCacheService } from './redis.cache';

@Module({
  imports: [TypeOrmModule.forFeature([UserMapping])],
  controllers: [UserMappingController],
  providers: [UserMappingService, RedisCacheService],
})
export class UserMappingModule {}
