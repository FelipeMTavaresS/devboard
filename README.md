# 🚀 DevBoard

**DevBoard** é um ecossistema backend robusto e escalável, construído com **NestJS** e estruturado como um **monorepo**. O projeto segue os princípios de **Clean Architecture** e **Test-Driven Development (TDD)** para garantir um código modular, testável e de fácil manutenção.

O sistema é composto por:
*   **`apps/api`**: API REST principal para gerenciamento de tarefas.
*   **`apps/tasks`**: Worker para processamento de jobs em background (em desenvolvimento).

---

## 🛠️ Tecnologias

*   **Framework:** [NestJS](https://nestjs.com/)
*   **Linguagem:** TypeScript
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Banco de Dados:** PostgreSQL (Hospedado no [Supabase](https://supabase.com/))
*   **Gerenciador de Pacotes:** pnpm
*   **Testes:** Jest

---

## 🚀 Como Rodar Localmente

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

### 1. Clonar o Repositório
```bash
git clone https://github.com/FelipeMTavaresS/devboard.git
cd devboard
```

### 2. Instalar as Dependências
```bash
pnpm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as suas credenciais do Supabase:
```env
DATABASE_URL="postgresql://postgres.[USER]:[PASSWORD]@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[USER]:[PASSWORD]@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
```

### 4. Gerar o Prisma Client
```bash
npx prisma generate
```

### 5. Sincronizar o Banco de Dados (Migrações)
```bash
npx prisma migrate dev
```

### 6. Iniciar as Aplicações
Para rodar a API principal (Porta 3000):
```bash
pnpm run start:dev api
```
Para rodar o app de Tasks (Porta 3001):
```bash
pnpm run start:dev tasks
```

---

## 🧪 Testes e Qualidade

Para garantir a integridade do código, rode os seguintes comandos:

*   **Lint:** `pnpm run lint` (Verifica e corrige padrões de código)
*   **Testes:** `pnpm run test` (Executa todos os testes unitários com mocks)
*   **Build:** `pnpm run build` (Valida a compilação do projeto)

---

## 📋 Funcionalidades Atuais (Módulo de Tasks)

*   [x] CRUD completo de tarefas.
*   [x] Definição de **Prioridade** (`LOW`, `MEDIUM`, `HIGH`).
*   [x] Filtragem de tarefas por prioridade via query string.
*   [x] Endpoint de estatísticas detalhadas.
*   [x] Persistência real com PostgreSQL/Supabase via Prisma.
