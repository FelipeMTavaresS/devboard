import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            complete: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            getStats: jest.fn(),
            findCompleted: jest.fn(),
            findPending: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto = { title: 'New Task' };
      const result = {
        id: 'uuid',
        ...dto,
        completed: false,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
    });
  });

  describe('getStats', () => {
    it('should return stats', async () => {
      const stats = { total: 10, completed: 5, pending: 5 };
      jest.spyOn(service, 'getStats').mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(result).toBe(stats);
      expect(service.getStats).toHaveBeenCalled();
    });
  });
});
