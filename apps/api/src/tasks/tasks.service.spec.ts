import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

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

  describe('complete', () => {
    it('should mark a task as completed', () => {
      const task = service.create('New Task');
      const completedTask = service.complete(task.id);

      expect(completedTask.completed).toBe(true);
    });

    it('should throw an error if task does not exist', () => {
      expect(() => service.complete('invalid-id')).toThrow('Task not found');
    });
  });

  describe('delete', () => {
    it('should remove a task', () => {
      const task = service.create('Task to be deleted');
      service.delete(task.id);
      const tasks = service.findAll();
      
      expect(tasks).not.toContain(task);
    });

    it('should throw an error if task to delete does not exist', () => {
      expect(() => service.delete('invalid-id')).toThrow('Task not found');
    });
  });

  describe('update', () => {
    it('should update a task title', () => {
      const task = service.create('Original Title');
      const updatedTask = service.update(task.id, 'Updated Title');
      
      expect(updatedTask.title).toBe('Updated Title');
      expect(service.findAll()[0].title).toBe('Updated Title');
    });

    it('should throw an error if task to update does not exist', () => {
      expect(() => service.update('invalid-id', 'New Title')).toThrow('Task not found');
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
