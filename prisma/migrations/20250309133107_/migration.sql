/*
  Warnings:

  - You are about to drop the column `image` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;
