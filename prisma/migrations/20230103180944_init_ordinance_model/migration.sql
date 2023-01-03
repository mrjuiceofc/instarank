-- CreateTable
CREATE TABLE "ordinances" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "instagram_username" TEXT NOT NULL,
    "sort_by" TEXT NOT NULL,
    "only_type" TEXT NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "until_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ordinances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ordinances" ADD CONSTRAINT "ordinances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
