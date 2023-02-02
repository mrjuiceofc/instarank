/*
  Warnings:

  - You are about to drop the column `from_date` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `instagram_username` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `only_type` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `post_limit` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `sort_by` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `until_date` on the `orders` table. All the data in the column will be lost.
  - Added the required column `amount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remains` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smm_order_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smm_service_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'PARTIAL', 'PROCESSING', 'CANCELLED', 'FAILED');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "from_date",
DROP COLUMN "instagram_username",
DROP COLUMN "only_type",
DROP COLUMN "post_limit",
DROP COLUMN "sort_by",
DROP COLUMN "until_date",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "remains" INTEGER NOT NULL,
ADD COLUMN     "smm_order_id" TEXT NOT NULL,
ADD COLUMN     "smm_service_id" TEXT NOT NULL,
ADD COLUMN     "status" "order_status" NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
