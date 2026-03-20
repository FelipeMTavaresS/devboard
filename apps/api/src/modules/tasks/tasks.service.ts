import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, Priority } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    title: string,
    priority?: Priority,
    description?: string,
    category?: string,
  ): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title,
        priority: priority ?? Priority.MEDIUM,
        description,
        category,
      },
    });
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async complete(id: string): Promise<Task> {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: { completed: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.task.delete({
      where: { id },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async findCompleted(): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { completed: true },
    });
  }

  async findPending(): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { completed: false },
    });
  }

  async findByPriority(priority: Priority): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { priority },
    });
  }

  async getStats() {
    const total = await this.prisma.task.count();
    const completed = await this.prisma.task.count({
      where: { completed: true },
    });
    const pending = total - completed;

    // Optional: stats by priority
    const low = await this.prisma.task.count({
      where: { priority: Priority.LOW },
    });
    const medium = await this.prisma.task.count({
      where: { priority: Priority.MEDIUM },
    });
    const high = await this.prisma.task.count({
      where: { priority: Priority.HIGH },
    });

    return {
      total,
      completed,
      pending,
      byPriority: {
        low,
        medium,
        high,
      },
    };
  }
}
