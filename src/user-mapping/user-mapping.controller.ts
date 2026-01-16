import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { UserMappingService } from './user-mapping.service';

class CreateUserMappingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'id1 must be at most 50 characters long' })
  id1: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'id2 must be at most 50 characters long' })
  id2: string;
}

@Controller('user-mapping')
export class UserMappingController {
  constructor(private readonly userMappingService: UserMappingService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints || {}),
        }));
        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  )
  async createOrGetUserMapping(
    @Body() createUserMappingDto: CreateUserMappingDto,
  ): Promise<{ userID: string }> {
    return this.userMappingService.findOrCreateUserMapping(
      createUserMappingDto.id1,
      createUserMappingDto.id2,
    );
  }
}
