import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { randomUUID } from 'crypto';

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

  private findTaskById(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  complete(id: string): Task {
    const task = this.findTaskById(id);
    task.completed = true;
    return task;
  }

  delete(id: string): void {
    const task = this.findTaskById(id);
    const taskIndex = this.tasks.indexOf(task);
    this.tasks.splice(taskIndex, 1);
  }

  update(id: string, title: string): Task {
    const task = this.findTaskById(id);
    task.title = title;
    return task;
  }

  findCompleted(): Task[] {
    return this.tasks.filter((task) => task.completed);
  }

  findPending(): Task[] {
    return this.tasks.filter((task) => !task.completed);
  }
}
