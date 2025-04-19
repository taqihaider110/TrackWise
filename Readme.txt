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
npx sequelize-cli db:migrate


🚀 Production:
NODE_ENV=production npx sequelize-cli db:migrate


🔁 Undo Migrations (Rollback)

🔧 Local (Undo last migration):
npx sequelize-cli db:migrate:undo

🚀 Production (Undo last migration):
NODE_ENV=production npx sequelize-cli db:migrate:undo
🔁 Undo All Migrations (Full rollback)

🔧 Local:
npx sequelize-cli db:migrate:undo:all

🚀 Production:
NODE_ENV=production npx sequelize-cli db:migrate:undo:all