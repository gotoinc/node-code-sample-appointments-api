/*
  Warnings:

  - You are about to drop the `email_auth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "email_auth" DROP CONSTRAINT "email_auth_fk_user_id_fkey";

-- DropTable
DROP TABLE "email_auth";

-- CreateTable
CREATE TABLE "email_credentials" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fk_user_id" INTEGER NOT NULL,

    CONSTRAINT "email_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_credentials_fk_user_id_key" ON "email_credentials"("fk_user_id");

-- AddForeignKey
ALTER TABLE "email_credentials" ADD CONSTRAINT "email_credentials_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
