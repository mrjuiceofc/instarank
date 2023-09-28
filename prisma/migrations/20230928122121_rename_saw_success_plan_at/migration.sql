/*
  Warnings:

  - You are about to drop the column `saw_success_plan` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "saw_success_plan",
ADD COLUMN     "saw_success_plan_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
