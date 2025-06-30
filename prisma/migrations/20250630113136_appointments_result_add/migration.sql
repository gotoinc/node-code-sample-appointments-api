-- CreateTable
CREATE TABLE "appointment_result" (
    "id" SERIAL NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,

    CONSTRAINT "appointment_result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appointment_result" ADD CONSTRAINT "appointment_result_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
