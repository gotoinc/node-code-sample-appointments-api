# Code samples appointments app

## How to run app and database

1. Clone the repo
2. Run `npm install`
3. Run `npm run docker:start`
4. Open `http://localhost:3000/api/docs` in your browser
5. Run `npm run docker:stop` to stop the docker containers

## How to run the app locally

1. Run `npm install`
2. Run `npm run start:dev`
3. You need to set the environment variables in the `.env` file, you can find .env.example file in the root folder
4. Be sure to set the `DATABASE_URL` environment variable to the correct database connection string. For this you can run `npm run docker:start`, then stop app container and left just database container or create your own database manually and run `npx prisma migrate dev --name init` to initialize the database

## Where to find the SQL schema

SQL schema is located in `sql/init.sql`

## How to run migrations

1. Run `npm install`
2. Run `npx prisma migrate dev --name <name>` to create the database
3. Run `npx prisma generate` to generate the client

## How to run tests

1. Run `npm run test`


