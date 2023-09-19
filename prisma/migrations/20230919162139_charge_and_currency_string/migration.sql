/*
  Warnings:

  - Made the column `charge` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currency` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "charge" SET NOT NULL,
ALTER COLUMN "currency" SET NOT NULL;
