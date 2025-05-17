-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "projects_is_archived_idx" ON "projects"("is_archived");
