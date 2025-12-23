/*
  Warnings:

  - A unique constraint covering the columns `[title,workspace_id]` on the table `board` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "board_title_workspace_id_key" ON "board"("title", "workspace_id");
