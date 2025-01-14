-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_user_role_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_user_id" INTEGER NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" SERIAL NOT NULL,
    "phone_number" TEXT NOT NULL,
    "licence_number" TEXT NOT NULL,
    "fk_user_id" INTEGER NOT NULL,
    "fk_specialization_id" INTEGER NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specializations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "patient_insurance_number" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_patient_id" INTEGER NOT NULL,
    "fk_slot_id" INTEGER NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slots" (
    "id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "fk_doctor_id" INTEGER NOT NULL,

    CONSTRAINT "slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_auth" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fk_user_id" INTEGER NOT NULL,

    CONSTRAINT "email_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_providers" (
    "id" SERIAL NOT NULL,
    "auth_provider_name" TEXT NOT NULL,

    CONSTRAINT "auth_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_auth_methods" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fk_user_id" INTEGER NOT NULL,
    "fk_auth_provider_id" INTEGER NOT NULL,

    CONSTRAINT "user_auth_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_fk_user_role_id_key" ON "users"("fk_user_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_fk_user_id_key" ON "patients"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_fk_user_id_key" ON "doctors"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_fk_specialization_id_key" ON "doctors"("fk_specialization_id");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_fk_patient_id_key" ON "appointments"("fk_patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_fk_slot_id_key" ON "appointments"("fk_slot_id");

-- CreateIndex
CREATE UNIQUE INDEX "slots_fk_doctor_id_key" ON "slots"("fk_doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_auth_fk_user_id_key" ON "email_auth"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_methods_email_key" ON "user_auth_methods"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_methods_fk_user_id_key" ON "user_auth_methods"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_methods_fk_auth_provider_id_key" ON "user_auth_methods"("fk_auth_provider_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fk_user_role_id_fkey" FOREIGN KEY ("fk_user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_fk_specialization_id_fkey" FOREIGN KEY ("fk_specialization_id") REFERENCES "specializations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_patient_id_fkey" FOREIGN KEY ("fk_patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_slot_id_fkey" FOREIGN KEY ("fk_slot_id") REFERENCES "slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_fk_doctor_id_fkey" FOREIGN KEY ("fk_doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_auth" ADD CONSTRAINT "email_auth_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_auth_methods" ADD CONSTRAINT "user_auth_methods_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_auth_methods" ADD CONSTRAINT "user_auth_methods_fk_auth_provider_id_fkey" FOREIGN KEY ("fk_auth_provider_id") REFERENCES "auth_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
