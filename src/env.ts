import { z } from "zod";
import "@t3-oss/env-nextjs/dist/env";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = envSchema.parse(process.env);
