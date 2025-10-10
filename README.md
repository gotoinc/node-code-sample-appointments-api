# Code samples appointments app

Appointements app API allows users to login and register through email and password or Google OAuth, create profiles, open timeslots for doctors, book appointments for patients, manage roles and specializations, and store files using MinIO.

## Technologies

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- PassportJS
- jsonwebtoken
- MinIO (S3-compatible storage)
- ESLint + Prettier

## Features

- User registration and authentication (email/password, Google OAuth)
- Role management (doctor, patient, admin)
- Doctor and patient profile creation and editing
- Opening and booking timeslots for appointments
- Doctor ratings and reviews
- Doctor specialization management
- File storage via MinIO with support for multiple buckets
- Data validation via DTOs and Zod
- Swagger documentation at `/api/docs`

## How to run app and database

1. Clone the repo
2. Run `npm install`
3. Run `npm run docker:start` (starts PostgreSQL and MinIO)
4. Open `http://localhost:3000/api/docs` in your browser for Swagger UI
5. Run `npm run docker:stop` to stop the docker containers

## How to run the app locally

1. Run `npm install`
2. Run `npm run start:dev`
3. Set environment variables in the `.env` file (see `.env.example`)
4. Be sure to set the `DATABASE_URL` environment variable to the correct database connection string. For this you can run `npm run docker:start`, then stop the app container and leave just the database container running, or create your own database manually and run `npx prisma migrate dev --name init` to initialize the database

## How to run MinIO

MinIO is started automatically via `npm run docker:start`.
- MinIO console: `http://localhost:9090`
- S3 API: `http://localhost:9000`
- Data is stored in `./minio-data`
- To use different buckets, pass the bucket name to MinioService via parameters or environment variables.

## Where to find the SQL schema

SQL schema is located in `sql/init.sql`

## How to run migrations

1. Run `npm install`
2. Run `npx prisma migrate dev --name <name>` to create/update the database
3. Run `npx prisma generate` to generate Prisma Client

## How to run tests

1. Run unit tests: `npm run test`
2. Run e2e tests: `npm run test:e2e`

## Project structure

- `src/appointments` — appointment management
- `src/doctors` — doctor profiles, ratings, specializations
- `src/patients` — patient profiles
- `src/roles` — user roles
- `src/specializations` — doctor specializations
- `src/minio-module` — MinIO integration
- `src/iam` — authentication and authorization
- `src/common` — shared interfaces, utilities, error handling
- `src/template_schedules` — schedule templates
- `src/timeslots` — appointment timeslots
- `src/users` — user management

## Swagger

API documentation is available at:  
`http://localhost:3000/api/docs`