-- CreateTable
CREATE TABLE "doctors_rating" (
    "id" SERIAL NOT NULL,
    "fk_doctor_id" INTEGER NOT NULL,
    "fk_patient_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctors_rating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doctors_rating" ADD CONSTRAINT "doctors_rating_fk_doctor_id_fkey" FOREIGN KEY ("fk_doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors_rating" ADD CONSTRAINT "doctors_rating_fk_patient_id_fkey" FOREIGN KEY ("fk_patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
