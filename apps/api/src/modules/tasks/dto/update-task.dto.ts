import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Priority } from '@prisma/client';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
