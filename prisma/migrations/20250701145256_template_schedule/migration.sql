-- CreateTable
CREATE TABLE "template_schedule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slotDuration" INTEGER NOT NULL,
    "schedule" JSONB NOT NULL,
    "doctor_id" INTEGER NOT NULL,

    CONSTRAINT "template_schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "template_schedule" ADD CONSTRAINT "template_schedule_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
