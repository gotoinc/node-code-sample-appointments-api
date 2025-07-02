-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "declined_by_doctor" BOOLEAN,
ADD COLUMN     "declined_by_patient" BOOLEAN;
