/*
  Warnings:

  - A unique constraint covering the columns `[appointment_id]` on the table `appointment_result` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "appointment_result_appointment_id_key" ON "appointment_result"("appointment_id");
