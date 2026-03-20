# DevBoard Frontend

Frontend extraído do projeto DevBoard, construído com Next.js 15 + TypeScript + Tailwind CSS v4.

## Setup rápido

```bash
npm install
npx shadcn@latest init
npm run dev
```

## Estrutura

```
app/                    # App Router (Next.js)
├── layout.tsx          # Layout raiz
├── providers.tsx       # QueryClient + Toaster
├── page.tsx            # Rota /
├── dashboard/page.tsx  # Rota /dashboard
├── tasks/page.tsx      # Rota /tasks
└── notes/page.tsx      # Rota /notes

src/
├── index.css           # Estilos globais (Tailwind + variáveis)
├── views/              # Componentes de página
├── components/         # Layout, UI components (shadcn)
├── hooks/              # Hooks da API — adaptar para seu backend
└── lib/utils.ts        # Utilitário cn()
```

## Adaptar os hooks

Os hooks em `src/hooks/` estão configurados para chamar `/api/*`.
Substitua as chamadas pelo seu backend:

```typescript
// src/hooks/use-tasks.ts
import { useQuery } from "@tanstack/react-query";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetch("/api/tasks").then(r => r.json()),
  });
}
```
