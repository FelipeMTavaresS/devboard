import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: {} }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ... existing tests ...

  it('should call findAll', () => {
    const findAllMock = jest.spyOn(controller, 'findAll');
    controller.findAll.bind(controller)(); // Updated line
    expect(findAllMock).toHaveBeenCalled();
  });

  it('should call create', () => {
    const createMock = jest.spyOn(controller, 'create');
    controller.create.bind(controller)(); // Updated line
    expect(createMock).toHaveBeenCalled();
  });
});