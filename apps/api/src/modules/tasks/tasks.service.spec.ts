import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks', () => {
      service.create('Task 1');
      service.create('Task 2');
      const tasks = service.findAll();
      expect(tasks).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', () => {
      const createdTask = service.create('Test Task');
      const foundTask = service.findOne(createdTask.id);
      expect(foundTask).toEqual(createdTask);
    });

    it('should throw NotFoundException if task does not exist', () => {
      expect(() => service.findOne('invalid-id')).toThrow(
        'Task with ID "invalid-id" not found',
      );
    });
  });

  describe('complete', () => {
    it('should mark a task as completed', () => {
      const task: Task = service.create('New Task');
      const completedTask = service.complete(task.id);

      expect(completedTask.completed).toBe(true);
    });

    it('should throw an error if task does not exist', () => {
      expect(() => service.complete('invalid-id')).toThrow(
        'Task with ID "invalid-id" not found',
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', () => {
      const task: Task = service.create('Task to be deleted');
      service.remove(task.id);
      const tasks = service.findAll();

      expect(tasks).not.toContain(task);
    });

    it('should throw an error if task to delete does not exist', () => {
      expect(() => service.remove('invalid-id')).toThrow(
        'Task with ID "invalid-id" not found',
      );
    });
  });

  describe('update', () => {
    it('should update a task title', () => {
      const task: Task = service.create('Original Title');
      const updatedTask = service.update(task.id, { title: 'Updated Title' });

      expect(updatedTask.title).toBe('Updated Title');
      expect(service.findAll()[0].title).toBe('Updated Title');
    });

    it('should throw an error if task to update does not exist', () => {
      expect(() =>
        service.update('invalid-id', { title: 'New Title' }),
      ).toThrow('Task with ID "invalid-id" not found');
    });
  });

  describe('findCompleted', () => {
    it('should return only completed tasks', () => {
      service.create('Task 1');
      const task2 = service.create('Task 2');
      service.complete(task2.id);

      const completedTasks = service.findCompleted();

      expect(completedTasks).toHaveLength(1);
      expect(completedTasks[0].id).toBe(task2.id);
      expect(completedTasks[0].completed).toBe(true);
    });
  });

  describe('findPending', () => {
    it('should return only pending tasks', () => {
      const task1 = service.create('Task 1');
      const task2 = service.create('Task 2');
      service.complete(task2.id);

      const pendingTasks = service.findPending();

      expect(pendingTasks).toHaveLength(1);
      expect(pendingTasks[0].id).toBe(task1.id);
      expect(pendingTasks[0].completed).toBe(false);
    });
  });
});
