# Trello Clone - TODO List

Este arquivo descreve todos os passos para criar, testar e implantar um clone do Trello usando a stack definida em `GEMINI.md`, com foco em hospedagem gratuita.

## Fase 1: Configuração e Setup do Projeto

- [x] **Inicializar o Projeto Next.js com Bun**
  - `bun create next-app . --typescript --tailwind --eslint`
- [x] **Configurar `tsconfig.json`**
  - Aplicar as configurações `strict` e `paths` conforme `GEMINI.md`.
- [x] **Instalar Dependências**
  - `bun add prisma zod next-auth @auth/prisma-adapter @t3-oss/env-nextjs`
  - `bun add -d @types/node`
- [x] **Inicializar `shadcn/ui`**
  - `bunx --bun shadcn-ui@latest init`
- [x] **Configurar Variáveis de Ambiente Tipadas**
  - Criar `src/env.ts` usando `@t3-oss/env-nextjs` para validar variáveis de ambiente (DATABASE_URL, NEXTAUTH_SECRET, etc.).
- [x] **Estrutura de Pastas**
  - Criar a estrutura de pastas (`components/layout`, `lib/actions`, `lib/db`, etc.) conforme `GEMINI.md`.
- [x] **Configurar Linter e Formatter**
  - Configurar Biome (ou ESLint/Prettier) e adicionar scripts em `package.json`.
- [x] **Setup do Prisma**
  - `bunx prisma init --datasource-provider postgresql`
  - Conectado a um banco de dados local via Docker.

## Fase 2: Banco de Dados e Modelos

- [ ] **Escolher Provedor de Banco de Dados Gratuito**
  - Criar uma conta em um serviço com tier gratuito de PostgreSQL (ex: [Supabase](https://supabase.com/), [Neon](https://neon.tech/)).
  - Obter a URL de conexão do banco de dados.
- [x] **Definir Schema do Prisma (`prisma/schema.prisma`)**
  - Criar modelo `User` (com `name`, `email`, `image`).
  - Criar modelo `Board` (quadro), com relação para `User`.
  - Criar modelo `List` (lista), com relação para `Board` e campo de `order`.
  - Criar modelo `Card` (cartão), com relação para `List` e campos como `title`, `description`, `order`.
  - Adicionar o adapter do NextAuth: `bunx prisma generate`.
- [x] **Criar o Singleton do Prisma Client**
  - Criar `src/lib/db/index.ts` para instanciar o `PrismaClient` globalmente.
- [x] **Executar a Primeira Migração**
  - `bunx prisma migrate dev --name init`

## Fase 3: Autenticação

- [x] **Configurar NextAuth.js**
  - Criar `src/lib/auth/options.ts` com as opções de autenticação.
  - Usar o `PrismaAdapter`.
  - Configurar um ou mais provedores OAuth gratuitos (ex: Google, GitHub).
- [ ] **Criar a Rota da API de Autenticação**
  - Criar `src/app/api/auth/[...nextauth]/route.ts`.
- [ ] **Criar Páginas de UI para Autenticação**
  - `(auth)/login/page.tsx` com botões de login para os provedores.
  - Adicionar componentes de UI (botão, card) do `shadcn/ui`.
- [ ] **Proteger Rotas com Middleware**
  - Criar `middleware.ts` para redirecionar usuários não autenticados de rotas protegidas (ex: `/dashboard`) para a página de login.
- [ ] **Componentes de Sessão**
  - Criar componentes para exibir informações do usuário (avatar, nome) e botões de `login`/`logout`.

## Fase 4: Funcionalidades Principais (Quadros, Listas, Cartões)

- [ ] **Página de Dashboard (Listagem de Quadros)**
  - Criar `(dashboard)/page.tsx`.
  - Criar Server Action (`getBoardsAction`) para buscar os quadros do usuário logado.
  - Exibir os quadros em formato de grid usando `Card` do `shadcn/ui`.
  - Adicionar um formulário/botão para criar um novo quadro.
- [ ] **Página de um Quadro Específico (`/board/{boardId}`)**
  - Criar a rota dinâmica `(dashboard)/board/[boardId]/page.tsx`.
  - Buscar os dados do quadro, incluindo suas listas e cartões.
  - Exibir as listas horizontalmente. Cada lista deve mostrar seus cartões verticalmente.
- [ ] **Server Actions para CRUD**
  - `createBoardAction`: Criar um novo quadro.
  - `createListAction`: Criar uma nova lista em um quadro.
  - `createCardAction`: Criar um novo cartão em uma lista.
  - `updateCardOrderAction`: Atualizar a ordem dos cartões e/ou a lista a que pertencem.
  - `updateListOrderAction`: Atualizar a ordem das listas.
- [ ] **Implementar Drag-and-Drop (Arrastar e Soltar)**
  - Escolher uma biblioteca de D&D (ex: `@hello-pangea/dnd` que é uma fork gratuita do `react-beautiful-dnd`, ou `@dnd-kit/core`).
  - Implementar o D&D para reordenar cartões dentro de uma lista.
  - Implementar o D&D para mover cartões entre listas.
- [ ] **Modal de Detalhes do Cartão**
  - Ao clicar em um cartão, abrir um modal (`Dialog` do `shadcn/ui`).
  - Exibir título, descrição, e outras informações.
  - Adicionar formulário para editar o título e a descrição (`Textarea`).

## Fase 5: Features Avançadas e Polimento

- [ ] **Logs de Atividade**
  - Criar um modelo `ActivityLog` no `schema.prisma`.
  - Criar uma Server Action genérica (`createLogAction`) para registrar atividades (ex: "Usuário X moveu o cartão Y para a lista Z").
  - Exibir um feed de atividades no modal do cartão ou em um painel lateral.
- [ ] **Loading e Skeletons**
  - Criar `loading.tsx` para o dashboard e a página do quadro.
  - Usar `Skeleton` do `shadcn/ui` para criar componentes de loading que imitam a UI final.
  - Usar `Suspense` para carregar partes da página de forma independente.
- [ ] **Validação com Zod**
  - Criar schemas Zod (`src/lib/validations`) para todos os inputs de formulários (criar quadro, lista, cartão, etc.).
  - Usar os schemas nas Server Actions para validar os dados no servidor.
  - (Opcional) Usar `zod` com `react-hook-form` para validação no cliente.

## Fase 6: Testes

- [ ] **Configurar `bun:test`**
  - Criar `test/setup.ts` se necessário.
- [ ] **Testes de Unidade**
  - Testar funções utilitárias (`/lib/utils`).
- [ ] **Testes de Componentes**
  - Testar componentes de UI isoladamente (ex: `Button`, `Card`).
  - Usar `render` e `screen` para verificar a renderização e interações.
- [ ] **Testes de Server Actions**
  - Mockar o `db` (Prisma Client) para testar a lógica das actions sem acessar o banco de dados real.
  - Verificar se as actions retornam os dados esperados ou os erros corretos.

## Fase 7: CI/CD e Implantação (Deploy)

- [ ] **Configurar Repositório no GitHub**
  - Criar um novo repositório no GitHub e enviar o código.
- [ ] **Escolher Plataforma de Deploy Gratuita**
  - Criar uma conta na [Vercel](https://vercel.com/) (recomendado para Next.js).
  - Conectar a conta da Vercel com o repositório do GitHub.
- [ ] **Configurar Variáveis de Ambiente na Vercel**
  - Adicionar `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` e outras variáveis de ambiente no painel do projeto na Vercel.
- [ ] **Configurar GitHub Actions**
  - Criar o workflow `.github/workflows/ci.yml`.
  - O pipeline deve rodar `lint`, `type-check` e `test` em cada push/pull request.
- [ ] **Primeiro Deploy**
  - A Vercel irá automaticamente fazer o deploy de cada push para a branch `main`.
  - Verificar o build e a aplicação em produção.
- [ ] **(Opcional) Configurar Rate Limiting**
  - Criar uma conta no [Upstash](https://upstash.com/) (oferece tier gratuito de Redis).
  - Obter as credenciais e configurar a biblioteca `@upstash/ratelimit` para proteger as Server Actions/API Routes mais críticas.

## Fase 8: Documentação e Manutenção

- [ ] **Atualizar `README.md`**
  - Adicionar descrição do projeto, como rodar localmente e link para a aplicação em produção.
- [ ] **Documentação de Código com JSDoc**
  - Adicionar comentários JSDoc para Server Actions, funções complexas e hooks, explicando o "porquê" do código.
- [ ] **Checklist Final de Deploy**
  - Revisar todos os itens da seção "Checklist de Deploy" do `GEMINI.md` antes de considerar o projeto "finalizado".
