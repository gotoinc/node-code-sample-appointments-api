/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `email_credentials` table. All the data in the column will be lost.
  - Added the required column `password_hash` to the `email_credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_credentials" DROP COLUMN "passwordHash",
ADD COLUMN     "password_hash" TEXT NOT NULL;
