/*
  Warnings:

  - A unique constraint covering the columns `[role_name]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_roles_role_name_key" ON "user_roles"("role_name");
