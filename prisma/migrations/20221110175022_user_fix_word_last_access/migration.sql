/*
  Warnings:

  - You are about to drop the column `last_acess` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "last_acess",
ADD COLUMN     "last_access" TIMESTAMP(3);
