'use server';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/session';

/**
 * Gets the boards for the currently logged in user.
 * 
 * @returns The user's boards or an error object.
 */
export async function getBoardsAction() {
  try {
    const session = await requireAuth();
    const boards = await db.board.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data: boards };
  } catch (error) {
    console.error('Get boards error:', error);
    return { success: false, error: 'Failed to get boards' };
  }
}

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createBoardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
});

export async function createBoardAction(formData: FormData) {
  try {
    const session = await requireAuth();
    const validated = createBoardSchema.parse({
      title: formData.get('title'),
    });

    const board = await db.board.create({
      data: {
        title: validated.title,
        userId: session.user.id,
      },
    });

    revalidatePath('/(dashboard)');

    return { success: true, data: board };
  } catch (error) {
    console.error('Create board error:', error);
    return { success: false, error: 'Failed to create board' };
  }
}
