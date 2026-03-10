import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    findAll: jest.fn().mockReturnValue([{ id: '1', title: 'Task 1', completed: false }]),
    create: jest.fn().mockImplementation((title: string) => ({
      id: '1',
      title,
      completed: false,
      createdAt: new Date(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', () => {
      const result = controller.findAll();
      
      expect(result).toEqual([{ id: '1', title: 'Task 1', completed: false }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new task', () => {
      const createTaskDto: CreateTaskDto = { title: 'New Task' };
      const result = controller.create(createTaskDto);

      expect(result.title).toBe(createTaskDto.title);
      expect(service.create).toHaveBeenCalledWith(createTaskDto.title);
    });
  });
});
