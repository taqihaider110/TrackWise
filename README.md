
# FINANCE TRACKER

## Running Locally

### Local Development with Local DB
To run the project locally with the local database:
```bash
npm run start:dev
```

### Local Development with Production DB
To run the project locally with the production database:
```bash
npm run start:prod
```

## Deployment

### Deploy to Render
To deploy the application to Render:
```bash
npm run deploy
```

## Migration Commands

Make sure you've already created your migration files using:
```bash
npx sequelize-cli migration:generate --name create-expenses-table
```

### Run Migrations

#### Local (Development)
To run migrations in the local development environment:
```bash
npm run db:migrate
```

#### Production
To run migrations in the production environment:
```bash
npm run db:migrate:prod
```

### Undo Migrations (Rollback)

#### Local (Undo Last Migration)
To undo the last migration in the local development environment:
```bash
npx sequelize-cli db:migrate:undo
```

#### Production (Undo Last Migration)
To undo the last migration in the production environment:
```bash
NODE_ENV=production npx sequelize-cli db:migrate:undo
```

### Undo All Migrations (Full Rollback)

#### Local
To undo all migrations in the local development environment:
```bash
npx sequelize-cli db:migrate:undo:all
```

#### Production
To undo all migrations in the production environment:
```bash
NODE_ENV=production npx sequelize-cli db:migrate:undo:all
```

## Seeding Commands

To populate your database with sample data (seeds).

### Run Seed Data

#### Seed Data Locally
To apply the seed data to the local development database:
```bash
npm run db:seed
```

#### Seed Data in Production
To apply the seed data to the production database:
```bash
npm run db:seed:prod
```

### Undo Seed Data

#### Undo Last Seed (Local)
To roll back the most recent seed in the local development database:
```bash
npm run db:seed:undo
```

#### Undo Last Seed (Production)
To roll back the most recent seed in the production database:
```bash
npm run db:seed:undo:prod
```

## Database Management

### Create Database
To create the database in your environment (useful for first-time setup):
```bash
npm run db:create
```

### Drop Database
To drop the existing database (useful when you need to reset):
```bash
npm run db:drop
```

---

## Additional Notes

- Ensure that you have configured your environment variables for local and production environments correctly.
- These commands assume you're using Sequelize CLI for database management.
- Adjust the scripts and commands according to your specific database setup or production pipeline.
