-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
