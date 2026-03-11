Project Identity

Project Name: DevBoard
Type: Backend API
Architecture: Monorepo
Framework: NestJS
Language: TypeScript
Development Strategy: Test Driven Development (TDD)

DevBoard is a backend system designed to provide a scalable service architecture for managing tasks and services. The system is structured using a modular monorepo approach, allowing independent applications and shared libraries.

The main API is located in apps/api and exposes a REST interface.

Repository Structure
apps/
  api/
    src/
      modules/
      controllers/
      services/

  tasks/

libs/

test/
apps/api

Main NestJS REST API.

Responsibilities:

HTTP request handling

business logic orchestration

validation

integration with persistence layers

apps/tasks

Responsible for background jobs and scheduled processes.

Examples:

async processing

cron jobs

queue consumers

libs

Reusable libraries shared across apps.

Examples:

shared types

utilities

domain logic

Architecture Rules

The project follows Clean Architecture principles.

Layer responsibilities:

Controller
   ↓
Service (Use Cases)
   ↓
Repository (Data Access)
   ↓
Database
Controllers

Controllers must only:

receive HTTP requests

validate inputs

call services

return responses

Controllers must not contain business logic.

Services

Services contain:

business rules

orchestration logic

domain logic

Services should be easily testable.

Repositories (Future Layer)

Repositories will handle:

database queries

persistence

entity mapping

Services should never interact directly with the database.

Test Driven Development (TDD)

All new features must follow TDD.

Workflow:

Write failing tests

Implement minimal code

Pass tests

Refactor

Testing framework:

Jest

Test location example:

tasks.service.spec.ts

Tests should cover:

service logic

edge cases

error handling

API Design Guidelines

The API must follow REST conventions.

Example endpoints:

GET    /tasks
POST   /tasks
GET    /tasks/:id
PATCH  /tasks/:id
DELETE /tasks/:id

Responses must use JSON.

Example response:

{
  "id": "uuid",
  "title": "Task name",
  "completed": false,
  "createdAt": "timestamp"
}

Errors should follow a consistent structure.

DTO Pattern

All inputs must use DTOs.

Example:

CreateTaskDto
UpdateTaskDto

Validation libraries:

class-validator

class-transformer

Coding Standards

General rules:

Use TypeScript strict mode

Prefer immutability

Avoid large classes

Keep functions small

Follow NestJS conventions

Naming conventions:

task.controller.ts
task.service.ts
task.module.ts
AI Agent Coding Rules

When an AI agent modifies this repository it must:

Respect the existing folder structure

Never add business logic inside controllers

Prefer creating new modules instead of bloated files

Always generate tests when creating services

Follow TDD when implementing features

Avoid introducing new frameworks without justification

Keep dependencies minimal

Git Workflow

Branch naming:

feature/task-module
fix/api-error
refactor/service-layer

Commit style:

feat: add tasks module
fix: correct validation bug
refactor: improve service structure
test: add tests for tasks service
Linting and Formatting

Tools used:

ESLint

Prettier

Before committing code the following must pass:

pnpm run lint
pnpm run test
CI/CD

Continuous Integration will be handled by GitHub Actions.

CI pipeline responsibilities:

install dependencies

run lint

run tests

validate build

Planned Features

Future improvements include:

database integration (PostgreSQL)

ORM integration (Prisma or TypeORM)

authentication (JWT)

background job queues

containerization with Docker

horizontal scalability

monitoring and logging

Design Philosophy

DevBoard prioritizes:

simplicity

modularity

testability

scalability

Every feature should be designed to evolve without breaking existing modules.