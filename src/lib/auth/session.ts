import { auth } from "@/lib/auth";

/**
 * Gets current user session.
 *
 * WHY: Centralized session retrieval for consistency
 * @returns Session object or null if not authenticated
 */
export async function getSession() {
  return await auth();
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
    throw new Error("Unauthorized");
  }
  return session;
}
