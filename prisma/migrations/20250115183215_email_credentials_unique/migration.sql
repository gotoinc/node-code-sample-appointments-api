/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `email_credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "email_credentials_email_key" ON "email_credentials"("email");
