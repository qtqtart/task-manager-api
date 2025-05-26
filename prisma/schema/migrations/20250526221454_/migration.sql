/*
  Warnings:

  - You are about to alter the column `first_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `last_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(255);
