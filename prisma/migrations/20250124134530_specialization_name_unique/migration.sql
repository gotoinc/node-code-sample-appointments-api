/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `specializations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "specializations_name_key" ON "specializations"("name");
