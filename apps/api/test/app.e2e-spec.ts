/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ApiModule } from './../src/api.module';

describe('ApiController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/tasks (POST)', () => {
    it('should create a task with valid data', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Valid Task Title' })
        .expect(201);
    });

    it('should fail to create a task with empty title', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ title: '' })
        .expect(400);
    });

    it('should fail to create a task with short title', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'ab' })
        .expect(400);
    });

    it('should fail to create a task with invalid field', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Valid Title', somethingElse: 'not allowed' })
        .expect(400);
    });
  });
});
