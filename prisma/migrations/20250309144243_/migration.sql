/*
  Warnings:

  - A unique constraint covering the columns `[task_id,project_id]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `project_id` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tags_title_idx";

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "project_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tags_task_id_project_id_key" ON "tags"("task_id", "project_id");

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
