/*
  Warnings:

  - You are about to drop the `slots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_fk_slot_id_fkey";

-- DropForeignKey
ALTER TABLE "slots" DROP CONSTRAINT "slots_fk_doctor_id_fkey";

-- DropTable
DROP TABLE "slots";

-- CreateTable
CREATE TABLE "timeslots" (
    "id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "fk_doctor_id" INTEGER NOT NULL,

    CONSTRAINT "timeslots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_slot_id_fkey" FOREIGN KEY ("fk_slot_id") REFERENCES "timeslots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeslots" ADD CONSTRAINT "timeslots_fk_doctor_id_fkey" FOREIGN KEY ("fk_doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
