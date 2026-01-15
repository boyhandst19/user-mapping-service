import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { UserMappingService } from './user-mapping.service';

class CreateUserMappingDto {
  @IsString()
  @IsNotEmpty()
  id1: string;

  @IsString()
  @IsNotEmpty()
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
