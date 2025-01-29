/*
  Warnings:

  - You are about to drop the column `fk_slot_id` on the `appointments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fk_timeslot_id]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fk_timeslot_id` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_fk_slot_id_fkey";

-- DropIndex
DROP INDEX "appointments_fk_slot_id_key";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "fk_slot_id",
ADD COLUMN     "fk_timeslot_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "appointments_fk_timeslot_id_key" ON "appointments"("fk_timeslot_id");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_timeslot_id_fkey" FOREIGN KEY ("fk_timeslot_id") REFERENCES "timeslots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
