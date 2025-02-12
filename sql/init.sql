-- Creating tables

CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_user_role_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_roles" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_user_id" INTEGER NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "doctors" (
    "id" SERIAL NOT NULL,
    "phone_number" TEXT NOT NULL,
    "licence_number" TEXT NOT NULL,
    "fk_user_id" INTEGER NOT NULL,
    "fk_specialization_id" INTEGER NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "specializations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("id")
);

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
    "fk_timeslot_id" INTEGER NOT NULL,
    "fk_doctor_id" INTEGER NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "timeslots" (
    "id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "fk_doctor_id" INTEGER NOT NULL,

    CONSTRAINT "timeslots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "email_credentials" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "fk_user_id" INTEGER NOT NULL,

    CONSTRAINT "email_credentials_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth_providers" (
    "id" SERIAL NOT NULL,
    "auth_provider_name" TEXT NOT NULL,

    CONSTRAINT "auth_providers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_auth_methods" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fk_user_id" INTEGER NOT NULL,
    "fk_auth_provider_id" INTEGER NOT NULL,

    CONSTRAINT "user_auth_methods_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE UNIQUE INDEX "user_roles_role_name_key" ON "user_roles"("role_name");

CREATE UNIQUE INDEX "patients_fk_user_id_key" ON "patients"("fk_user_id");

CREATE UNIQUE INDEX "doctors_fk_user_id_key" ON "doctors"("fk_user_id");

CREATE UNIQUE INDEX "specializations_name_key" ON "specializations"("name");

CREATE UNIQUE INDEX "appointments_fk_timeslot_id_key" ON "appointments"("fk_timeslot_id");

CREATE UNIQUE INDEX "email_credentials_email_key" ON "email_credentials"("email");

CREATE UNIQUE INDEX "email_credentials_fk_user_id_key" ON "email_credentials"("fk_user_id");

CREATE UNIQUE INDEX "auth_providers_auth_provider_name_key" ON "auth_providers"("auth_provider_name");

CREATE UNIQUE INDEX "user_auth_methods_email_key" ON "user_auth_methods"("email");

CREATE UNIQUE INDEX "user_auth_methods_fk_user_id_key" ON "user_auth_methods"("fk_user_id");

ALTER TABLE "users" ADD CONSTRAINT "users_fk_user_role_id_fkey" FOREIGN KEY ("fk_user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "patients" ADD CONSTRAINT "patients_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "doctors" ADD CONSTRAINT "doctors_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "doctors" ADD CONSTRAINT "doctors_fk_specialization_id_fkey" FOREIGN KEY ("fk_specialization_id") REFERENCES "specializations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_patient_id_fkey" FOREIGN KEY ("fk_patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_timeslot_id_fkey" FOREIGN KEY ("fk_timeslot_id") REFERENCES "timeslots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_doctor_id_fkey" FOREIGN KEY ("fk_doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "timeslots" ADD CONSTRAINT "timeslots_fk_doctor_id_fkey" FOREIGN KEY ("fk_doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "email_credentials" ADD CONSTRAINT "email_credentials_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_auth_methods" ADD CONSTRAINT "user_auth_methods_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_auth_methods" ADD CONSTRAINT "user_auth_methods_fk_auth_provider_id_fkey" FOREIGN KEY ("fk_auth_provider_id") REFERENCES "auth_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Initial data

INSERT INTO "user_roles" ("role_name") VALUES ('patient'), ('doctor');

INSERT INTO "auth_providers" ("auth_provider_name") VALUES ('google');

INSERT INTO "specializations" ("name") VALUES ('general practitioner'), ('psychiatrist'), ('dentist');
