import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    findAll: jest
      .fn()
      .mockReturnValue([{ id: '1', title: 'Task 1', completed: false }]),
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn().mockImplementation((title: string) => ({
      id: '1',
      title,
      completed: false,
      createdAt: new Date(),
    })),
    remove: jest.fn(),
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
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', () => {
      const result = controller.findAll();

      expect(result).toEqual([{ id: '1', title: 'Task 1', completed: false }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single task', () => {
      const task = { id: '1', title: 'Task 1', completed: false };
      jest.spyOn(service, 'findOne').mockReturnValue(task);

      const result = controller.findOne('1');

      expect(result).toEqual(task);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a task', () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Title',
        completed: true,
      };
      const task = { id: '1', title: 'Updated Title', completed: true };
      jest.spyOn(service, 'update').mockReturnValue(task);

      const result = controller.update('1', updateTaskDto);

      expect(result).toEqual(task);
      expect(service.update).toHaveBeenCalledWith('1', updateTaskDto);
    });
  });

  describe('remove', () => {
    it('should remove a task', () => {
      controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
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
