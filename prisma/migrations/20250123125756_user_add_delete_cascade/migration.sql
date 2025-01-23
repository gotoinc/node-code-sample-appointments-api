-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "email_credentials" DROP CONSTRAINT "email_credentials_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_auth_methods" DROP CONSTRAINT "user_auth_methods_fk_user_id_fkey";

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_credentials" ADD CONSTRAINT "email_credentials_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_auth_methods" ADD CONSTRAINT "user_auth_methods_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
