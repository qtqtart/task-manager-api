-- CreateTable
CREATE TABLE "task_assignee" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,

    CONSTRAINT "task_assignee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_assignee_user_id_task_id_key" ON "task_assignee"("user_id", "task_id");

-- AddForeignKey
ALTER TABLE "task_assignee" ADD CONSTRAINT "task_assignee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignee" ADD CONSTRAINT "task_assignee_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
