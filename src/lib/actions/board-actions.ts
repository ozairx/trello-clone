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
      include: {
        workspaces: {
          include: {
            workspace: {
              include: {
                boards: {
                  orderBy: {
                    createdAt: "desc",
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Flatten the boards from all workspaces the user is a member of
    const boards = user.workspaces.flatMap(
      (workspaceMember) => workspaceMember.workspace.boards,
    );

    return { success: true, data: boards };
  } catch (error) {
    console.error("Get boards error:", error);
    return { success: false, error: "Failed to get boards" };
  }
}

const createBoardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export async function createBoardAction(formData: FormData) {
  try {
    const session = await requireAuth();
    const validated = createBoardSchema.parse({
      title: formData.get("title"),
      workspaceId: formData.get("workspaceId"),
    });

    // Verify user is a member of the workspace
    const isMember = await db.workspaceMember.findFirst({
      where: {
        userId: session.user.id,
        workspaceId: validated.workspaceId,
      },
    });

    if (!isMember) {
      return {
        success: false,
        error: "Unauthorized to create board in this workspace",
      };
    }

    const board = await db.board.create({
      data: {
        title: validated.title,
        workspaceId: validated.workspaceId,
      },
    });

    revalidatePath(`/u/${session.user.username}/boards`);

    return { success: true, data: board };
  } catch (error) {
    console.error("Create board error:", error);
    return { success: false, error: "Failed to create board" };
  }
}
