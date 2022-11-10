/*
  Warnings:

  - You are about to drop the column `last_access` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "last_access",
ADD COLUMN     "last_access_at" TIMESTAMP(3);
