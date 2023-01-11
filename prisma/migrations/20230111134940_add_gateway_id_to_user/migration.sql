/*
  Warnings:

  - A unique constraint covering the columns `[gateway_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gateway_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_gateway_id_key" ON "users"("gateway_id");
