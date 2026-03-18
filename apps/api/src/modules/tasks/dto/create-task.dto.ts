import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
