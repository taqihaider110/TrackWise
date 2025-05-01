Run locally with local DB:

npm run start:dev


Run locally but with production DB:
npm run start:prod


Deploy to Render:
npm run deploy


✅ MIGRATION COMMANDS
Make sure you've already created your migration files using:
npx sequelize-cli migration:generate --name create-expenses-table


🔹 Run Migrations
🔧 Local (Development):
npm run db:migrate

🚀 Production:
npm run db:migrate:prod


🔁 Undo Migrations (Rollback)

🔧 Local (Undo last migration):
npx sequelize-cli db:migrate:undo

🚀 Production (Undo last migration):
npm run db:migrate:undo:prod


🔁 Undo All Migrations (Full rollback)

🔧 Local:
npx sequelize-cli db:migrate:undo:all

🚀 Production:
npm run db:migrate:undo:all:prod


SEEDING COMMANDS
To populate your database with sample data (seeds).

Run Seed Data:
Seed Data Locally: Apply the seed data to the local development database:
npm run db:seed

Seed Data in Production: Apply the seed data to the production database:
npm run db:seed:prod


Undo Seed Data:

Undo Last Seed (Local): Roll back the most recent seed in the local development database:
npm run db:seed:undo

Undo Last Seed (Production): Roll back the most recent seed in the production database:
npm run db:seed:undo:prod


Create Database:
To create the database in your environment (useful for first-time setup):
npm run db:create

Drop Database:
To drop the existing database (useful when you need to reset):
npm run db:drop
