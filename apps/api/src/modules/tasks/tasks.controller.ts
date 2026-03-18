import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, Priority } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(
      createTaskDto.title,
      createTaskDto.priority,
    );
  }

  @Get()
  async findAll(@Query('priority') priority?: Priority): Promise<Task[]> {
    if (priority) {
      return this.tasksService.findByPriority(priority);
    }
    return this.tasksService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.tasksService.getStats();
  }

  @Get('completed')
  async findCompleted(): Promise<Task[]> {
    return this.tasksService.findCompleted();
  }

  @Get('pending')
  async findPending(): Promise<Task[]> {
    return this.tasksService.findPending();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string): Promise<Task> {
    return this.tasksService.complete(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }
}
