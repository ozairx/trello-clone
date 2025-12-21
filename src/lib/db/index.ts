import { PrismaClient } from "@prisma/client";
import { env } from "@/env"; // Assuming env.ts is in src, and it exports 'env'

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
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
