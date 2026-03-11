import { Module } from '@nestjs/common';
import { ApiController } from './controllers/api.controller';
import { ApiService } from './services/api.service';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
