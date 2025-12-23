"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Gets the boards for the currently logged in user.
 *
 * @returns The user's boards or an error object.
 */
export async function getBoardsAction(username: string) {
  try {
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const boards = await db.board.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: boards };
  } catch (error) {
    console.error("Get boards error:", error);
    return { success: false, error: "Failed to get boards" };
  }
}

const createBoardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
});

export async function createBoardAction(formData: FormData) {
  try {
    const session = await requireAuth();
    const validated = createBoardSchema.parse({
      title: formData.get("title"),
    });

    const board = await db.board.create({
      data: {
        title: validated.title,
        userId: session.user.id,
      },
    });

    revalidatePath(`/u/${session.user.username}/boards`);

    return { success: true, data: board };
  } catch (error) {
    console.error("Create board error:", error);
    return { success: false, error: "Failed to create board" };
  }
}
