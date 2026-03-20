# 🚀 DevBoard

**DevBoard** é um ecossistema completo de backend e frontend, construído com **NestJS** e **Next.js**, estruturado como um **monorepo**. O projeto segue os princípios de **Clean Architecture** e **Test-Driven Development (TDD)** para garantir um código modular, testável e de fácil manutenção.

O sistema é composto por:
*   **`apps/api`**: API REST principal para gerenciamento de tarefas (NestJS).
*   **`apps/tasks`**: Worker para processamento de jobs em background (em desenvolvimento).
*   **`apps/web`**: Interface web moderna para gerenciamento de tarefas (Next.js).

---

## 🛠️ Tecnologias

### Backend
*   **Framework:** [NestJS](https://nestjs.com/)
*   **Linguagem:** TypeScript
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Banco de Dados:** PostgreSQL (Hospedado no [Supabase](https://supabase.com/))
*   **Testes:** Jest

### Frontend
*   **Framework:** [Next.js 15](https://nextjs.org/)
*   **Linguagem:** TypeScript
*   **UI Components:** Radix UI + Tailwind CSS
*   **State Management:** TanStack Query (React Query)
*   **Animações:** Framer Motion

### Gerenciamento
*   **Gerenciador de Pacotes:** pnpm
*   **Monorepo:** pnpm workspaces

---

## 🚀 Como Rodar o Projeto (Passo a Passo)

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- **Node.js** (v18 ou superior) - [Download](https://nodejs.org/)
- **pnpm** (v8 ou superior) - [Instalação](https://pnpm.io/installation)
- **Git** - [Download](https://git-scm.com/)

### 1. Clonar o Repositório

```bash
git clone https://github.com/FelipeMTavaresS/devboard.git
cd devboard
```

### 2. Instalar as Dependências

```bash
pnpm install
```

Este comando irá instalar todas as dependências de todos os apps no monorepo.

### 3. Configurar as Variáveis de Ambiente

⚠️ **IMPORTANTE - SEGURANÇA:**
- **NUNCA** commite o arquivo `.env` no Git
- O `.env` contém credenciais sensíveis (senhas do banco de dados)
- Use o `.env.example` como template
- Adicione sempre `.env` no `.gitignore`

Crie um arquivo `.env` na **raiz do projeto** com as credenciais do Supabase:

```bash
# Copie o template
cp .env.example .env

# Depois edite com suas credenciais reais
```

Conteúdo do `.env`:

```env
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.[USER]:[PASSWORD]@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.[USER]:[PASSWORD]@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
```

**Como obter as credenciais:**
1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com/)
2. Vá em **Settings** → **Database**
3. Copie a **Connection String** (modo Pooler para `DATABASE_URL`)
4. Copie a **Connection String** (modo Direct para `DIRECT_URL`)
5. Substitua `[USER]` e `[PASSWORD]` pelos seus valores reais

### 4. Gerar o Prisma Client

```bash
npx prisma generate
```

Este comando gera os tipos TypeScript baseados no schema do Prisma.

### 5. Aplicar as Migrações no Banco de Dados

```bash
npx prisma migrate deploy
```

Se estiver em desenvolvimento e quiser criar novas migrações:

```bash
npx prisma migrate dev --name nome_da_migracao
```

### 6. Iniciar as Aplicações

Você precisa rodar **2 servidores** em terminais separados:

#### Terminal 1: API Backend (NestJS)

```bash
pnpm run start:dev
```

A API estará disponível em: **http://localhost:3000**

#### Terminal 2: Frontend (Next.js)

```bash
cd apps/web
npm run dev
```

O frontend estará disponível em: **http://localhost:3001**

---

## 📡 Endpoints da API

A API REST está disponível em `http://localhost:3000`

### Tarefas (Tasks)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Health check (retorna "Hello World!") |
| `GET` | `/tasks` | Lista todas as tarefas |
| `GET` | `/tasks?priority=HIGH` | Filtra tarefas por prioridade |
| `GET` | `/tasks/stats` | Estatísticas das tarefas |
| `GET` | `/tasks/completed` | Lista tarefas completas |
| `GET` | `/tasks/pending` | Lista tarefas pendentes |
| `GET` | `/tasks/:id` | Busca uma tarefa por ID |
| `POST` | `/tasks` | Cria uma nova tarefa |
| `PATCH` | `/tasks/:id` | Atualiza uma tarefa |
| `PATCH` | `/tasks/:id/complete` | Marca tarefa como completa |
| `DELETE` | `/tasks/:id` | Deleta uma tarefa |

### Exemplos de Requisições

#### Criar uma tarefa (POST /tasks)

```json
{
  "title": "Estudar NestJS",
  "description": "Ler documentação oficial",
  "category": "Estudos",
  "priority": "HIGH"
}
```

#### Atualizar uma tarefa (PATCH /tasks/:id)

```json
{
  "title": "Estudar NestJS e Prisma",
  "description": "Ler documentação oficial e fazer testes",
  "category": "Estudos",
  "priority": "MEDIUM",
  "completed": false
}
```

#### Resposta de Sucesso

```json
{
  "id": "9c0ae676-e6bb-4d61-abd7-b12fc679e6be",
  "title": "Estudar NestJS",
  "description": "Ler documentação oficial",
  "category": "Estudos",
  "completed": false,
  "priority": "HIGH",
  "createdAt": "2026-03-20T18:29:16.770Z"
}
```

---

## 🧪 Testes e Qualidade de Código

### Rodar os Testes

```bash
# Todos os testes
pnpm run test

# Testes em modo watch
pnpm run test:watch

# Coverage
pnpm run test:cov
```

### Rodar o Linter

```bash
# Backend (API + Tasks)
npx eslint "apps/api/**/*.ts" "apps/tasks/**/*.ts" --fix

# Ou usar o comando global (pode incluir warnings do Next.js)
pnpm run lint
```

### Validar o Build

```bash
pnpm run build
```

### Checklist Antes de Commitar

✅ Execute os comandos abaixo e certifique-se que todos passam:

```bash
npx prisma generate          # Atualiza tipos do Prisma
npx eslint "apps/api/**/*.ts" "apps/tasks/**/*.ts" --fix  # Lint backend
pnpm run test                # Testes
pnpm run build               # Build
```

---

## 📂 Estrutura do Projeto

```
devboard/
├── apps/
│   ├── api/                 # API REST (NestJS)
│   │   ├── src/
│   │   │   ├── database/    # Configuração do Prisma
│   │   │   ├── modules/
│   │   │   │   └── tasks/   # Módulo de Tasks
│   │   │   │       ├── dto/
│   │   │   │       ├── tasks.controller.ts
│   │   │   │       ├── tasks.service.ts
│   │   │   │       ├── tasks.module.ts
│   │   │   │       ├── tasks.controller.spec.ts
│   │   │   │       └── tasks.service.spec.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── test/
│   │
│   ├── tasks/               # Background Worker
│   │   └── src/
│   │
│   └── web/                 # Frontend (Next.js)
│       ├── app/
│       ├── src/
│       │   ├── components/
│       │   ├── hooks/       # React Hooks (use-tasks.ts)
│       │   └── views/       # Páginas (tasks.tsx)
│       └── package.json
│
├── prisma/
│   ├── schema.prisma        # Schema do banco de dados
│   └── migrations/          # Histórico de migrações
│
├── libs/                    # Bibliotecas compartilhadas
├── .env                     # Variáveis de ambiente
├── package.json
├── pnpm-workspace.yaml      # Configuração do monorepo
├── tsconfig.json
├── gemini.md               # Documentação do projeto
└── README.md
```

---

## 📋 Funcionalidades Atuais

### Backend (API)
*   ✅ CRUD completo de tarefas
*   ✅ Prioridades: `LOW`, `MEDIUM`, `HIGH`
*   ✅ Campos: título, descrição, categoria, status
*   ✅ Filtragem por prioridade
*   ✅ Endpoints de estatísticas
*   ✅ Testes unitários com mocks do Prisma
*   ✅ Validação de dados com class-validator

### Frontend (Web)
*   ✅ Interface moderna e responsiva
*   ✅ Listagem de tarefas
*   ✅ Criação de novas tarefas
*   ✅ **Edição de tarefas** (título, descrição, categoria, prioridade)
*   ✅ Marcar tarefas como completas
*   ✅ Deletar tarefas
*   ✅ Filtros por status (all/pending/completed)
*   ✅ Busca por texto
*   ✅ Animações suaves
*   ✅ Suporte a temas (dark/light)
*   ✅ Internacionalização (PT/EN)

---

## 🗄️ Schema do Banco de Dados

### Task Model

```prisma
model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  category    String?
  completed   Boolean  @default(false)
  priority    Priority @default(MEDIUM)
  createdAt   DateTime @default(now())

  @@map("tasks")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

---

## 🔧 Comandos Úteis do Prisma

```bash
# Ver o banco de dados no Prisma Studio
npx prisma studio

# Resetar o banco de dados (⚠️ apaga todos os dados)
npx prisma migrate reset

# Criar uma nova migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações em produção
npx prisma migrate deploy

# Atualizar o Prisma Client
npx prisma generate
```

---

## 🐛 Troubleshooting

### Erro de conexão com o banco de dados

**Problema:** `Can't reach database server`

**Solução:**
1. Verifique se as credenciais no `.env` estão corretas
2. Certifique-se de que o Supabase está ativo
3. Teste a conexão com `npx prisma db pull`

### Porta 3000 ou 3001 já em uso

**Problema:** `EADDRINUSE: address already in use`

**Solução:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill
lsof -ti:3001 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Avisos de certificado HTTPS no Codespaces

**Problema:** `net::ERR_CERT_AUTHORITY_INVALID`

**Solução:** Isso é normal no GitHub Codespaces. Clique em "Avançado" → "Prosseguir para o site" no navegador.

---

## 📝 Convenções de Código

### Commits

Seguimos a convenção [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona campo de categoria nas tasks
fix: corrige validação de prioridade
refactor: reorganiza estrutura de pastas
test: adiciona testes para TasksService
docs: atualiza README com novos endpoints
```

### Branches

```
feature/nome-da-feature
fix/nome-do-bug
refactor/nome-da-refatoracao
```

---

## 🔒 Segurança

### ⚠️ Variáveis de Ambiente

**NUNCA commite arquivos com credenciais sensíveis:**

❌ **NÃO FAZER:**
- Commitar `.env` no repositório
- Compartilhar credenciais em código
- Expor senhas em logs ou mensagens de erro

✅ **FAZER:**
- Usar `.env` apenas localmente
- Commitar `.env.example` (sem credenciais reais)
- Manter `.env` no `.gitignore`
- Usar variáveis de ambiente em produção (Railway, Vercel, etc.)

### 🔐 Se Você Commitou Credenciais Acidentalmente

Se você commitou o `.env` por engano:

```bash
# 1. Remover do tracking do Git
git rm --cached .env

# 2. Commitar a remoção
git commit -m "chore: remove .env from git tracking"

# 3. IMPORTANTE: Trocar as credenciais no Supabase
# As credenciais antigas estão expostas no histórico do Git
# Vá no Supabase Dashboard e gere novas credenciais

# 4. (Opcional) Limpar histórico - CUIDADO!
# Isso reescreve o histórico do Git
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença UNLICENSED (uso privado).

---

## 🙋‍♂️ Autor

**Felipe M. Tavares S.**

- GitHub: [@FelipeMTavaresS](https://github.com/FelipeMTavaresS)

---

## 🎯 Próximos Passos

- [ ] Adicionar autenticação de usuários
- [ ] Implementar tags/labels para tasks
- [ ] Adicionar datas de vencimento
- [ ] Sistema de notificações
- [ ] Dashboard com gráficos
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Subtasks (tarefas aninhadas)
- [ ] Colaboração em tempo real
