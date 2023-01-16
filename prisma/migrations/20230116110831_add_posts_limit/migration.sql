/*
  Warnings:

  - Added the required column `post_limit` to the `ordinances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ordinances" ADD COLUMN     "post_limit" INTEGER NOT NULL;
