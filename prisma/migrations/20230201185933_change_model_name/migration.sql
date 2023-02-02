/*
  Warnings:

  - You are about to drop the `ordinances` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ordinances" DROP CONSTRAINT "ordinances_user_id_fkey";

-- DropTable
DROP TABLE "ordinances";

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "instagram_username" TEXT NOT NULL,
    "sort_by" TEXT NOT NULL,
    "only_type" TEXT NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "until_date" TIMESTAMP(3) NOT NULL,
    "post_limit" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
