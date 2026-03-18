import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Priority } from '@prisma/client';

const mockTask = {
  id: 'uuid-1',
  title: 'Test Task',
  completed: false,
  priority: Priority.MEDIUM,
  createdAt: new Date(),
};

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              create: jest.fn().mockResolvedValue(mockTask),
              findMany: jest.fn().mockResolvedValue([mockTask]),
              findUnique: jest.fn().mockResolvedValue(mockTask),
              update: jest
                .fn()
                .mockResolvedValue({ ...mockTask, completed: true }),
              delete: jest.fn().mockResolvedValue(mockTask),
              count: jest.fn().mockResolvedValue(1),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a task with high priority', async () => {
      const highTask = { ...mockTask, priority: Priority.HIGH };
      jest.spyOn(prisma.task, 'create').mockResolvedValue(highTask);

      const result = await service.create('High Task', Priority.HIGH);

      expect(result.priority).toBe(Priority.HIGH);
      expect(prisma.task.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTask]);
      expect(prisma.task.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const result = await service.findOne('uuid-1');
      expect(result).toEqual(mockTask);
      expect(prisma.task.findUnique).toHaveBeenCalled();
    });

    it('should throw NotFoundException if task does not exist', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('complete', () => {
    it('should mark a task as completed', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(mockTask);
      const result = await service.complete('uuid-1');
      expect(result.completed).toBe(true);
      expect(prisma.task.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(mockTask);
      await service.remove('uuid-1');
      expect(prisma.task.delete).toHaveBeenCalled();
    });
  });

  describe('findByPriority', () => {
    it('should return tasks filtered by priority', async () => {
      const result = await service.findByPriority(Priority.LOW);
      expect(result).toEqual([mockTask]);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { priority: Priority.LOW },
      });
    });
  });

  describe('getStats', () => {
    it('should return stats including priority counts', async () => {
      jest
        .spyOn(prisma.task, 'count')
        .mockResolvedValueOnce(3) // total
        .mockResolvedValueOnce(1) // completed
        .mockResolvedValueOnce(1) // low
        .mockResolvedValueOnce(1) // medium
        .mockResolvedValueOnce(1); // high

      const stats = await service.getStats();

      expect(stats.total).toBe(3);
      expect(stats.byPriority.high).toBe(1);
    });
  });
});
