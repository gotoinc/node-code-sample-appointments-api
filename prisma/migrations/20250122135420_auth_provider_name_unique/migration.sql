/*
  Warnings:

  - A unique constraint covering the columns `[auth_provider_name]` on the table `auth_providers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auth_providers_auth_provider_name_key" ON "auth_providers"("auth_provider_name");
