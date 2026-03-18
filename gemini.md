Project Identity

Project Name: DevBoard
Type: Backend API
Architecture: Monorepo
Framework: NestJS
Language: TypeScript
Development Strategy: Test Driven Development (TDD)
Persistence: Prisma ORM (PostgreSQL / Supabase)

DevBoard is a backend system designed to provide a scalable service architecture for managing tasks and services. The system is structured using a modular monorepo approach, allowing independent applications and shared libraries.

Repository Structure
apps/
  api/ (Main REST API)
    src/
      app.module.ts (Root Module)
      app.controller.ts (Global Handlers)
      app.service.ts
      database/ (Prisma Integration)
      modules/
        tasks/ (Task Management Feature)

  tasks/ (Background Worker)
    src/
      app.module.ts
      app.controller.ts
      app.service.ts

libs/ (Shared logic between apps)

prisma/
  schema.prisma (Database Schema)

Architecture Rules

The project follows Clean Architecture and Modular principles.

Layer responsibilities:

Controller
   ↓
Service (Use Cases)
   ↓
Prisma (Data Access)
   ↓
Supabase (PostgreSQL)

Organizational Rules:
- No global `controllers/` or `services/` folders.
- All domain logic must reside within specific modules (e.g., `modules/tasks`).
- Each application in the monorepo has its own `AppModule`, `AppController`, and `AppService` at the `src` root.

Data Persistence (Prisma & Supabase)

The project uses Prisma ORM for type-safe database access.

Model: Task
- id: String (UUID)
- title: String
- completed: Boolean (Default: false)
- priority: Enum (LOW, MEDIUM, HIGH)
- createdAt: DateTime

Workflow for Database Changes:
1. Update `prisma/schema.prisma`.
2. Run `npx prisma generate` to update types locally.
3. Run `npx prisma migrate dev --name [description]` to apply changes to Supabase.

Test Driven Development (TDD)

All new features must follow TDD with Prisma mocks.

Testing framework: Jest

Test location example: `tasks.service.spec.ts`

Mocking strategy:
- Use a mock `PrismaService` to prevent tests from requiring a real database connection.
- Ensure all service methods are asynchronous (`Promise`).

API Design Guidelines

The API follows REST conventions.

Example endpoints:
GET    /tasks (Supports ?priority=HIGH filter)
POST   /tasks
GET    /tasks/stats (Includes priority statistics)
PATCH  /tasks/:id/complete
DELETE /tasks/:id

Coding Standards

Rigor Rules:
- No `eslint-disable`.
- Type Safety: All variables and function returns must be properly typed.
- Async/Await: All database operations must be handled asynchronously.

Git Workflow

Branch naming:
- feature/task-priority
- fix/prisma-connection
- refactor/folder-structure

Commit style:
- feat: add task priority with prisma
- refactor: organize folders to nest standards
- test: mock prisma service in tasks tests

**Atomic Commits Rule**:
- **Commit per Feature**: Every new feature or significant change must be committed individually once it is implemented and verified (tests passing). Avoid batching multiple unrelated features in a single commit.

CI Readiness:
Before committing, ensure the following pass:
- `pnpm run lint`
- `pnpm run test`
- `pnpm run build`
- `npx prisma generate` (to ensure types are up to date)
