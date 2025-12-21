# Guia de Arquitetura Next.js Full-Stack com Bun e shadcn/ui

## Stack Tecnológica

- **Framework:** Next.js 15+ (App Router)
- **Runtime:** Bun (desenvolvimento e produção)
- **UI Components:** shadcn/ui + Tailwind CSS
- **Linguagem:** TypeScript (strict mode)
- **Banco de Dados:** Prisma ORM + PostgreSQL
- **Autenticação:** NextAuth.js v5 ou Better-Auth
- **Validação:** Zod
- **Estado:** Zustand ou Context API (evite Redux para apps menores)
- **Cache:** React Query/TanStack Query
- **Testing:** Bun Test

## Convenções de Idioma

**IMPORTANTE:** 
- ✅ **Código em inglês:** variáveis, funções, tipos, comentários, logs, mensagens de erro
- ✅ **UI em português:** textos exibidos ao usuário (labels, mensagens, notificações)

```typescript
// ✅ CORRETO
function calculateUserDiscount(userId: string): number {
  // Get user from database
  const user = await db.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    console.error('User not found:', userId);
    throw new Error('User not found');
  }
  
  return user.discount;
}

// UI em português para o usuário
<Button>Calcular Desconto</Button>
<p>Desconto aplicado com sucesso!</p>

// ❌ INCORRETO - código em português
function calcularDescontoUsuario(idUsuario: string): number {
  // Buscar usuário no banco
  const usuario = await db.usuario.findUnique({ where: { id: idUsuario } });
  ...
}
```

## Estrutura de Pastas

```
src/
├── app/                          # App Router do Next.js
│   ├── (auth)/                   # Route groups para layouts específicos
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx       # Loading UI específico
│   │   └── register/
│   │       ├── page.tsx
│   │       └── loading.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   └── [...route]/route.ts
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── loading.tsx               # Global loading
│   ├── error.tsx                 # Global error
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Header, Footer, Sidebar
│   ├── forms/                    # Form components
│   ├── skeletons/                # Loading skeletons
│   └── features/                 # Feature-specific components
├── lib/
│   ├── actions/                  # Server Actions
│   ├── api/                      # API clients e helpers
│   ├── auth/                     # Auth configuration
│   ├── db/                       # Prisma client e queries
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   ├── validations/              # Zod schemas
│   └── constants.ts
├── types/
│   ├── index.ts
│   └── api.ts
├── middleware.ts                 # Next.js middleware
└── env.ts                        # Variáveis de ambiente tipadas
```

## Configuração Inicial

### 1. tsconfig.json (Strict)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowJs": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      " @/*": ["./src/*"]
    }
  }
}
```

### 2. Variáveis de Ambiente Tipadas

```typescript
// src/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

## Convenções de Código

### Nomenclatura

- **Componentes:** PascalCase (`UserProfile.tsx`)
- **Hooks:** camelCase com prefixo `use` (`useAuth.ts`)
- **Server Actions:** camelCase com sufixo `Action` (`createUserAction.ts`)
- **API Routes:** kebab-case (`/api/user-settings`)
- **Utilitários:** camelCase (`formatDate.ts`)
- **Tipos/Interfaces:** PascalCase com prefixo I para interfaces (`IUser`, `type User`)

### Componentes

```typescript
// ✅ GOOD: Server Component by default
export default async function UserProfile({ userId }: { userId: string }) {
  const user = await db.user.findUnique({ where: { id: userId } });
  
  return (
    <div>
      <h1>{user.name}</h1>
      <UserActions userId={userId} />
    </div>
  );
}

// ✅ GOOD: Client Component when necessary
'use client';

import { useState } from 'react';

export function UserActions({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  
  return <button onClick={handleClick}>Action</button>;
}
```

## Documentação In-Code

### Princípios de Comentários

**Comente o *porquê*, não o *o quê*.** O código já mostra o que faz — explique o motivo, trade-offs e decisões.

### O que comentar (prioridade)

1. **Motivation** — why this algorithm/approach was chosen
2. **Invariants and preconditions** — what must be true entering/exiting
3. **Subtle cases and workarounds** — why the "hack" is necessary (reference bug/issue)
4. **Complexity and trade-offs** — O(N) vs O(N log N), memory usage, known limits
5. **Architectural decisions** — why this API exists, patterns, backwards compatibility
6. **Security/permissions/privacy** — warnings about sensitive data
7. **Integration points** — expected formats, protocols, contracts with other services
8. **TODO / FIXME** — with issue reference and clear context
9. **Usage examples** — expected inputs/outputs, especially in libraries

### JSDoc para APIs Públicas

```typescript
/**
 * Calculates cart total with taxes and coupons applied.
 * 
 * This function applies business rules defined in Q4 2025 marketing campaign.
 * Uses promotional discount logic from https://github.com/org/repo/issues/123
 * 
 * @param cart - Cart items (quantity must be > 0)
 * @param couponCode - Valid coupon code or null
 * @returns Total in cents (integer)
 * @throws {InvalidCouponError} if coupon is invalid or expired
 * 
 * @complexity O(n) where n = number of items
 * @sideEffects Sends analytics event via analytics.trackPurchase()
 * 
 * @example
 * ```ts
 * const total = calculateTotal(cart, "SAVE20");
 * // returns 8000 (R$ 80.00)
 * ```
 */
export function calculateTotal(
  cart: Cart,
  couponCode: string | null
): number {
  // Apply VIP discount first (business rule: VIP takes precedence)
  const vipDiscount = cart.user.isVip ? 0.15 : 0;
  
  // NOTE: We multiply before dividing to avoid floating point errors
  // See: https://github.com/org/repo/issues/456
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  return Math.floor(subtotal * (1 - vipDiscount));
}
```

### Exemplos — Ruim vs Bom

```typescript
// ❌ BAD: States the obvious
// increment i
i++;

// ✅ GOOD: Explains why
// Advance cursor to next index
// NOTE: Using post-increment because processItem(i++) depends on current value
i++;
```

```typescript
// ❌ BAD: No context
function applyDiscount(price: number): number {
  return price * 0.85;
}

// ✅ GOOD: Clear motivation and constraints
/**
 * Applies 15% promotional discount for VIP customers.
 * 
 * WHY: Marketing campaign rule for Q4 2025 (product X only)
 * PRECONDITION: price >= 0
 * SIDE EFFECT: Logs event to analytics (see analytics.sendEvent)
 * 
 * @see https://github.com/org/repo/issues/789
 */
function applyDiscount(price: number): number {
  if (price < 0) {
    console.error('Invalid price:', price);
    throw new Error('Price must be non-negative');
  }
  
  return price * 0.85;
}
```

### Templates para Comentários

**Function header:**
```typescript
/**
 * WHAT (1 line): intention / purpose
 * WHY: reason, trade-offs, when to choose differently
 * PRECONDITIONS: expectations about inputs/state
 * SIDE EFFECTS: mutations, logs, external calls
 * 
 * @complexity Time/space complexity
 */
```

**TODO comments:**
```typescript
// TODO(issue #1234): Refactor to use streaming => reduces memory for large datasets
// RISK: Current implementation fails if X > 1e6
// ASSIGNED: @username
```

**Workaround comments:**
```typescript
// WORKAROUND: NextAuth bug with custom providers in production
// Temporary fix until https://github.com/nextauthjs/next-auth/issues/XXXX is resolved
// Added: 2025-01-15
// Remove after upgrading to next-auth @5.1.0
```

### Checklist de Comentários

- [ ] Does this comment explain *why* not *what*?
- [ ] Is a refactor more useful than a comment?
- [ ] Is there a reference to issue/PR when relevant?
- [ ] Is it in the same language as code (English)?
- [ ] Is it short, specific, and not duplicating code?

### 30-Second Heuristic

**When to comment:**
- If it takes >30 seconds to explain to another person why you wrote this
- If the code seems "magical" without context

**When NOT to comment:**
- Obvious operations (e.g., `i++` without special behavior)
- Trivial variable assignments
- Already clear from function/variable names

## Loading States (loading.tsx)

Use `loading.tsx` files for automatic loading UI during suspense boundaries.

### Global Loading

```typescript
// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
```

### Route-Specific Loading

```typescript
// src/app/(dashboard)/loading.tsx
import { Skeleton } from ' @/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-[250px]" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[125px]" />
        ))}
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  );
}
```

### Nested Loading with Suspense

```typescript
// src/app/dashboard/page.tsx
import { Suspense } from 'react';
import { UserStatsSkeleton } from ' @/components/skeletons/user-stats';
import { ChartSkeleton } from ' @/components/skeletons/chart';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Each section loads independently */}
      <Suspense fallback={<UserStatsSkeleton />}>
        <UserStats />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <AnalyticsChart />
      </Suspense>
      
      <Suspense fallback={<TableSkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
```

### Skeleton Components

```typescript
// src/components/skeletons/user-stats.tsx
import { Skeleton } from ' @/components/ui/skeleton';

export function UserStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-[60px]" />
        </div>
      ))}
    </div>
  );
}
```

## Server Actions

```typescript
// src/lib/actions/user-actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from ' @/lib/db';

const updateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});

/**
 * Updates user profile information.
 * 
 * WHY: Separated from API routes for better type safety and automatic serialization
 * SIDE EFFECTS: 
 * - Revalidates user profile page cache
 * - Logs update event to analytics
 * 
 * @param userId - User ID to update
 * @param data - User data conforming to updateUserSchema
 * @returns Success object with updated user or error
 * 
 * @throws Never throws - returns error object instead
 * @complexity O(1) database operation
 */
export async function updateUserAction(
  userId: string,
  data: z.infer<typeof updateUserSchema>
) {
  try {
    // 1. Validate input
    const validated = updateUserSchema.parse(data);
    
    // 2. Check authentication
    const session = await getSession();
    if (!session || session.user.id !== userId) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // 3. Execute operation
    const user = await db.user.update({
      where: { id: userId },
      data: validated,
    });
    
    // 4. Revalidate cache
    revalidatePath(`/profile/${userId}`);
    
    console.log('User updated successfully:', { userId });
    
    return { success: true, data: user };
  } catch (error) {
    console.error('Update user error:', error);
    return { success: false, error: 'Failed to update user' };
  }
}
```

## Performance

### 1. Otimização de Imagens

```typescript
import Image from 'next/image';

// ✅ GOOD: Use Next/Image always
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// ✅ GOOD: Use sizes for responsive images
<Image
  src={user.avatar}
  alt={user.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>
```

### 2. Streaming e Suspense

```typescript
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<UserSkeleton />}>
        <UserData />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <Analytics />
      </Suspense>
    </div>
  );
}
```

### 3. Cache Estratégico

```typescript
// src/lib/db/queries.ts
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

/**
 * Gets user by ID with React-level caching.
 * 
 * WHY: Uses React cache() to deduplicate requests within a single render pass
 * SCOPE: Cache lives only during the current request
 * 
 * @see https://react.dev/reference/react/cache
 */
export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});

/**
 * Gets public statistics with persistent caching.
 * 
 * WHY: Stats don't change frequently, safe to cache for 1 hour
 * REVALIDATION: Automatic after 3600s OR manual via revalidateTag('stats')
 * 
 * @complexity O(1) when cached, O(n) on cache miss
 */
export const getPublicStats = unstable_cache(
  async () => {
    return db.stats.findFirst();
  },
  ['public-stats'],
  { revalidate: 3600, tags: ['stats'] }
);
```

### 4. Lazy Loading

```typescript
import dynamic from 'next/dynamic';

// ✅ GOOD: Lazy load heavy components
const HeavyChart = dynamic(() => import(' @/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR if necessary
});

// ✅ GOOD: Code splitting by route
const AdminPanel = dynamic(() => import(' @/components/AdminPanel'));
```

### 5. Parallel Data Fetching

```typescript
// ❌ BAD: Sequential
async function getPageData() {
  const user = await getUser();
  const posts = await getPosts();
  const comments = await getComments();
  return { user, posts, comments };
}

// ✅ GOOD: Parallel
async function getPageData() {
  const [user, posts, comments] = await Promise.all([
    getUser(),
    getPosts(),
    getComments(),
  ]);
  return { user, posts, comments };
}
```

## Segurança

### 1. Autenticação e Autorização

```typescript
// src/lib/auth/session.ts
import { getServerSession } from 'next-auth';
import { authOptions } from './options';

/**
 * Gets current user session.
 * 
 * WHY: Centralized session retrieval for consistency
 * @returns Session object or null if not authenticated
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Requires authentication or throws error.
 * 
 * WHY: Simplifies auth checks in Server Actions and API Routes
 * @throws {Error} if user is not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

// src/lib/auth/permissions.ts
/**
 * Checks if user can edit a post.
 * 
 * RULES:
 * - Post author can always edit
 * - Admin users can edit any post
 * 
 * @see https://github.com/org/repo/wiki/Permissions
 */
export function canEditPost(userId: string, post: Post): boolean {
  return post.authorId === userId || post.author.role === 'ADMIN';
}
```

### 2. Middleware de Proteção

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware for authentication and security headers.
 * 
 * RESPONSIBILITIES:
 * - Redirects unauthenticated users from protected routes
 * - Redirects authenticated users away from auth pages
 * - Sets security headers on all responses
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard');
  
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 3. Validação Dupla

```typescript
// ✅ GOOD: Validate on client AND server
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from ' @hookform/resolvers/zod';
import { userSchema } from ' @/lib/validations/user';

export function UserForm() {
  const form = useForm({
    resolver: zodResolver(userSchema), // Client validation
  });
  
  async function onSubmit(data: FormData) {
    // Server validation happens in Server Action
    const result = await updateUserAction(data);
  }
}
```

### 4. Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from ' @upstash/ratelimit';
import { Redis } from ' @upstash/redis';

/**
 * Rate limiter using Upstash Redis.
 * 
 * CONFIGURATION: 10 requests per 10 second window
 * WHY: Prevents API abuse while allowing reasonable usage
 * 
 * @see https://github.com/upstash/ratelimit
 */
const redis = new Redis({
  url: env.UPSTASH_REDIS_URL,
  token: env.UPSTASH_REDIS_TOKEN,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

// Usage in API Routes
export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // ... rest of logic
}
```

## Escalabilidade

### 1. Estrutura de Banco de Dados

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt @@index([email])
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt @@index([authorId])
  @@index([published, createdAt])
}
```

### 2. Pagination e Infinite Scroll

```typescript
// src/lib/actions/post-actions.ts
/**
 * Gets paginated posts using cursor-based pagination.
 * 
 * WHY: Cursor-based pagination scales better than offset for large datasets
 * TRADE-OFF: Cannot jump to arbitrary pages, but performs consistently at any depth
 * 
 * @param cursor - ID of last item from previous page (undefined for first page)
 * @param limit - Number of items to fetch (default: 10)
 * @returns Posts array and next cursor for pagination
 * 
 * @complexity O(log n) with proper indexing
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
 */
export async function getPostsAction({
  cursor,
  limit = 10,
}: { 
  cursor?: string;
  limit?: number;
}) {
  const posts = await db.post.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
  
  let nextCursor: string | undefined = undefined;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem!.id;
  }
  
  return { posts, nextCursor };
}
```

### 3. Database Connection Pooling

```typescript
// src/lib/db/index.ts
import { PrismaClient } from ' @prisma/client';

/**
 * Prisma client singleton.
 * 
 * WHY: Prevents multiple instances in development hot reload
 * IMPORTANT: In serverless, each function instance has its own client
 * 
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined;
};

export const db = 
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

## Design e UI (shadcn/ui)

### 1. Tema e Design Tokens

```typescript
// src/app/globals.css
 @tailwind base;
 @tailwind components;
 @tailwind utilities;

 @layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... outros tokens */
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... outros tokens */
  }
}
```

### 2. Componentes Reutilizáveis

```typescript
// src/components/ui/data-table.tsx
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from ' @tanstack/react-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

/**
 * Reusable data table component with sorting and pagination.
 * 
 * WHY: Standardizes table UI across the application
 * FEATURES: Built-in sorting, pagination, and responsive design
 * 
 * @example
 * ```tsx
 * <DataTable columns={userColumns} data={users} />
 * ```
 */
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        {/* ... implementation */}
      </Table>
    </div>
  );
}
```

## Testing com Bun Test

### 1. Setup de Testes

```typescript
// bunfig.toml
[test]
preload = ["./test/setup.ts"]
```

```typescript
// test/setup.ts
import { beforeAll, afterAll } from 'bun:test';

beforeAll(() => {
  // Global test setup
});

afterAll(() => {
  // Global test cleanup
});
```

### 2. Testes de Componentes

```typescript
// src/components/__tests__/Button.test.tsx
import { describe, it, expect } from 'bun:test';
import { render, screen } from ' @testing-library/react';
import userEvent from ' @testing-library/user-event';
import { Button } from '../ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('calls onClick when clicked', async () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });
  
  it('is disabled when loading', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 3. Testes de Server Actions

```typescript
// src/lib/actions/__tests__/user-actions.test.ts
import { describe, it, expect, mock } from 'bun:test';
import { updateUserAction } from '../user-actions';

// Mock database
const mockDb = {
  user: {
    update: mock(() => Promise.resolve({ id: '1', name: 'John' })),
  },
};

describe('updateUserAction', () => {
  it('updates user successfully', async () => {
    const result = await updateUserAction('user-1', {
      name: 'John Doe',
      email: 'john @example.com',
    });
    
    expect(result.success).toBe(true);
    expect(mockDb.user.update).toHaveBeenCalled();
  });
  
  it('returns error for invalid email', async () => {
    const result = await updateUserAction('user-1', {
      name: 'John',
      email: 'invalid-email',
    });
    
    expect(result.success).toBe(false);
  });
});
```

### 4. Testes de Utilities

```typescript
// src/lib/utils/__tests__/format.test.ts
import { describe, it, expect } from 'bun:test';
import { formatCurrency, formatDate } from '../format';

describe('formatCurrency', () => {
  it('formats BRL correctly', () => {
    expect(formatCurrency(1000)).toBe('R$ 10,00');
  });
  
  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });
});

describe('formatDate', () => {
  it('formats date in pt-BR', () => {
    const date = new Date('2025-01-15');
    expect(formatDate(date)).toBe('15/01/2025');
  });
});
```

### 5. Test Coverage

```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage

# Run specific test file
bun test src/components/__tests__/Button.test.tsx
```

## Git Hooks com Husky

### 1. Instalação

```bash
bun add -d husky lint-staged
bunx husky init
```

### 2. Pre-commit Hook

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run linter and formatter on staged files
bun run lint-staged
```

### 3. Pre-push Hook

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run type checking
echo "🔍 Running type check..."
bun run type-check

# Run tests
echo "🧪 Running tests..."
bun test

# Check if build passes
echo "🏗️  Running build..."
bun run build
```

### 4. Commit Message Hook

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format
bunx --no -- commitlint --edit $1
```

### 5. Lint-Staged Configuration

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

### 6. Commitlint Configuration

```javascript
// commitlint.config.js
module.exports = {
  extends: [' @commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Code restructuring
        'perf',     // Performance
        'test',     // Tests
        'chore',    // Maintenance
        'ci',       // CI/CD
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
  },
};
```

## GitHub Actions

### 1. CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout @v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun @v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run linter
        run: bun run lint
      
      - name: Run type check
        run: bun run type-check
      
      - name: Run tests
        run: bun test
      
      - name: Upload coverage
        uses: codecov/codecov-action @v3
        with:
          files: ./coverage/coverage-final.json

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: lint-and-test
    
    steps:
      - name: Checkout code
        uses: actions/checkout @v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun @v1
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Build application
        run: bun run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact @v3
        with:
          name: build
          path: .next/
```

### 2. Deploy Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout @v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun @v1
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run database migrations
        run: bun prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Build application
        run: bun run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action @v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 3. Database Backup

```yaml
# .github/workflows/backup.yml
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM UTC
  workflow_dispatch: # Manual trigger

jobs:
  backup:
    name: Backup Database
    runs-on: ubuntu-latest
    
    steps:
      - name: Backup PostgreSQL
        run: |
          pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Upload to S3
        uses: aws-actions/configure-aws-credentials @v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - run: |
          aws s3 cp backup-$(date +%Y%m%d).sql s3://my-backups/
```

### 4. Security Scanning

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 1' # Weekly on Monday

jobs:
  dependency-scan:
    name: Dependency Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout @v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action @master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload results to GitHub Security
        uses: github/codeql-action/upload-sarif @v2
        with:
          sarif_file: 'trivy-results.sarif'
```

### 5. Semantic Release

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout @v4
        with:
          fetch-depth: 0
      
      - name: Setup Bun
        uses: oven-sh/setup-bun @v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Semantic Release
        run: bunx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 6. Performance Monitoring

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    name: Lighthouse
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout @v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun @v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Build app
        run: bun run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action @v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/dashboard
          uploadArtifacts: true
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\"",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "bun run prisma/seed.ts",
    "prepare": "husky install"
  }
}
```

## Monitoramento e Logging

### 1. Error Tracking

```typescript
// src/lib/monitoring.ts
import * as Sentry from ' @sentry/nextjs';

/**
 * Captures error with context for monitoring.
 * 
 * WHY: Centralized error tracking for production debugging
 * ENVIRONMENTS: Only sends to Sentry in production
 * 
 * @param error - Error object to track
 * @param context - Additional context about the error
 */
export function captureError(error: Error, context?: Record<string, any>) {
  console.error('Error captured:', error, context);
  
  if (env.NODE_ENV === 'production') {
    Sentry.captureException(error, { extra: context });
  }
}
```

### 2. Performance Monitoring

```typescript
// src/lib/analytics.ts
/**
 * Tracks custom event in analytics.
 * 
 * WHY: Unified analytics tracking across the app
 * PROVIDER: Google Analytics 4
 * 
 * @param name - Event name (use snake_case)
 * @param properties - Event properties
 */
export function trackEvent(name: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, properties);
  }
}

export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
}
```

## Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Database migrations executadas
- [ ] Build sem erros
- [ ] Testes passando (bun test)
- [ ] Type check passando (tsc --noEmit)
- [ ] Lint passando (bun run lint)
- [ ] Security headers configurados
- [ ] Rate limiting implementado
- [ ] Monitoring e error tracking ativos
- [ ] Performance otimizada (Lighthouse score > 90)
- [ ] SEO configurado (metadata, sitemap, robots.txt)
- [ ] Analytics configurado
- [ ] Backups de banco de dados configurados
- [ ] Git hooks funcionando
- [ ] CI/CD pipeline testado

## Referências

- [Next.js Docs](https://nextjs.org/docs)
- [Next.js loading.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- [Bun Docs](https://bun.sh/docs)
- [Bun Test](https://bun.sh/docs/test)
- [shadcn/ui](https://ui.shadcn.com)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Husky Git Hooks](https://typicode.github.io/husky)
- [GitHub Actions](https://docs.github.com/en/actions)

# Regras para Banco de Dados PostgreSQL

## Convenções de Nomenclatura Obrigatórias

### Bancos de Dados
- Sempre usar snake_case minúsculo
- Formato: `nome_projeto_ambiente` (ex: `ecommerce_ambiente`, `gestao_vendas_dev`)
- Nunca usar espaços ou caracteres especiais
- Nunca usar maiúsculas

### Tabelas
- Sempre no singular: `usuario`, `pedido`, `produto`
- snake_case minúsculo
- Nomes descritivos e concisos

### Colunas
- snake_case minúsculo
- Chave primária: sempre `id`
- Chaves estrangeiras: `nome_tabela_id` (ex: `usuario_id`, `categoria_id`)
- Timestamps: `created_at`, `updated_at`
- Booleanos: prefixo `is_` ou `has_` (ex: `is_active`, `has_discount`)

### Índices
- Formato: `idx_nome_tabela_coluna` (ex: `idx_usuario_email`)

### Constraints
- Primary Key: `pk_nome_tabela`
- Foreign Key: `fk_tabela_origem_tabela_destino`
- Unique: `uq_nome_tabela_coluna`
- Check: `chk_nome_tabela_regra`

## Exemplos Práticos
```sql
-- ✅ CORRETO
CREATE DATABASE ecommerce_prod;
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ❌ INCORRETO
CREATE DATABASE "EcommerceProd";
CREATE TABLE Usuarios (
    ID SERIAL PRIMARY KEY,
    Email VARCHAR(255)
);
```

## Regra Geral
Sempre revisar nomenclaturas antes de executar comandos SQL. Questionar se algo não seguir essas convenções.