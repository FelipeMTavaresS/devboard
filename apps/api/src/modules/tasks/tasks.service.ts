import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { randomUUID } from 'crypto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  create(title: string): Task {
    const task: Task = {
      id: randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };

    this.tasks.push(task);
    return task;
  }

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  complete(id: string): Task {
    const task = this.findOne(id);
    task.completed = true;
    return task;
  }

  remove(id: string): void {
    const task = this.findOne(id);
    const taskIndex = this.tasks.indexOf(task);
    this.tasks.splice(taskIndex, 1);
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);
    
    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    
    if (updateTaskDto.completed !== undefined) {
      task.completed = updateTaskDto.completed;
    }
    
    return task;
  }

  findCompleted(): Task[] {
    return this.tasks.filter((task) => task.completed);
  }

  findPending(): Task[] {
    return this.tasks.filter((task) => !task.completed);
  }
}
