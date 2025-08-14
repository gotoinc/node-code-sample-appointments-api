/*
  Warnings:

  - Added the required column `hospital_address` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospital_name` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professional_since` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "hospital_address" TEXT NOT NULL,
ADD COLUMN     "hospital_name" TEXT NOT NULL,
ADD COLUMN     "professional_since" TIMESTAMP(3) NOT NULL;
