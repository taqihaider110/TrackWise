
# TrackWise

## Introduction
Managing personal finances is a challenge that most people face, often without a clear system in place. People rely on disorganized notes, spreadsheets, or fragmented mobile apps, making it difficult to get a unified view of their income and spending habits. TrackWise aims to solve this by providing a centralized, intuitive, and extensible web application where users can track their finances effectively.  

This project is built using Angular 19 for the frontend and Node.js for the backend, following a modular, scalable structure. The app focuses on foundational features that allow manual tracking and sorting, accompanied by insightful data visualization.

## Problem Statement
Most individuals today lack a centralized, easy-to-use platform for managing their finances. With money being spent across cash, cards, and multiple services, users often:  
● Lose track of where their money is going.  
● Rely on scattered tools like notes and spreadsheets.  
● Miss out on potential savings due to lack of visibility.  
TrackWise addresses this relatable pain point by offering a structured financial tracking tool tailored to real-life usage.  

## Objectives
● Provide a secure, user-friendly platform for recording and managing financial transactions.  
● Allow full control over expenses and income records through CRUD operations.  
● Visualize income and spending patterns in real-time using interactive dashboards.  
● Display monthly income sources and expense categories through interactive charts.  

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

## UI Showcase

### User Authentication:
● **Purpose**: Ensure that only registered users can securely access their personal financial data on TrackWise.  
● **Features**:  
  - **Secure Sign-Up and Login**: Users can register and log in using validated forms, with backend API integration for authentication.  
  - **JWT Session Management**: Stores a JWT token and expiration timestamp in `localStorage`, automatically logging users out after 1 hour.  
  - **Route Protection with Auth Guard**: Sensitive pages like Dashboard, Profile, Income, and Expenses are restricted to authenticated users only.

![image](https://github.com/user-attachments/assets/9707aa5a-68c3-4f17-9174-715f9d377cc3)
![image](https://github.com/user-attachments/assets/8a6b86cf-d04c-4855-9f1a-133215341b8d)

### Expense Management:
● **Purpose**: Allow users to log, manage, and visualize their monthly expenses with clarity and control.  
● **Features**:  
  - **Complete CRUD Operations**: Users can add, update, delete, and view their expenses, all integrated with secure backend APIs.  
  - **Filtering by Month and Year**: Enables users to filter expenses based on selected month and year for focused analysis.  
  - **Visual Expense Insights**: Displays a 12-month trend using a line chart and a category-wise breakdown with a pie chart for better financial understanding.


![image](https://github.com/user-attachments/assets/ab59c86f-5e57-4aca-a557-34641c4c7402)
![image](https://github.com/user-attachments/assets/f3548479-7fb9-46b3-95f0-8274b53866c8)
![image](https://github.com/user-attachments/assets/486357fa-b680-4464-8ea9-bb3dbe811b3f)
![image](https://github.com/user-attachments/assets/11bdb879-5494-468a-aa30-fa21acce3bc2)


### Income Management:
● **Purpose**: Enable users to track and manage all sources of income with full control and visibility.  
● **Features**:  
  - **Complete CRUD Operations**: Users can add, edit, delete, and view income entries through secure, authenticated API calls.  
  - **Filtering by Month and Year**: Allows users to analyze income records based on specific time periods.  
  - **Visual Income Insights**: Includes a 12-month trend line chart and a source-wise income pie chart for real-time analysis.

![image](https://github.com/user-attachments/assets/d50f9f4e-3516-4950-9636-e716ece9e275)
![image](https://github.com/user-attachments/assets/266b0e44-00d4-4b29-99c1-b934d6c8ec9c)
![image](https://github.com/user-attachments/assets/a30129d1-e9f3-4c2f-9987-c6a115c5050e)

### Dashboard:
● **Purpose**: Provide users with a centralized and dynamic overview of their financial activity, including income, expenses, and savings.  
● **Features**:  
  - **12-Month Trend Graphs**: Displays three line charts showing income, expenses, and savings trends over the past year.  
  - **Current Month Breakdown**: Includes two pie charts for category-wise breakdowns of income and expenses for the selected month.  
  - **Dynamic Monthly Savings**: Automatically calculates and displays total savings based on selected month.  
  - **Month Navigation Controls**: Allows users to easily switch between months to explore historical or upcoming financial data.

![image](https://github.com/user-attachments/assets/2199e867-1bba-4570-9d95-e7acb5788c5e)


### Profile Management:
● **Purpose**: Allow users to create and manage their personal information, ensuring a personalized and consistent experience in TrackWise.  
● **Features**:  
  - **Basic and Optional Info**: Users can enter essential details like name and date of birth, and update optional contact and address information anytime.  
  - **Profile Completion Flexibility**: Supports starting with minimal data and completing the profile later at the user’s convenience.  
  - **Centralized User Identity**: Maintains organized contact and location data for use across the application, enhancing personalization.

![image](https://github.com/user-attachments/assets/d9e16dad-8c5e-4cd6-874a-a182b2a43aa0)
![image](https://github.com/user-attachments/assets/2aded1eb-fe3c-4c59-acf3-01f4eb90b203)


## Other Pages:

### About Us
![image](https://github.com/user-attachments/assets/b0ba3ac9-56e4-4342-86ed-088858f1841b)

### Contact Us
![image](https://github.com/user-attachments/assets/b3351f9f-c844-4664-b2c7-7fd5631d3624)

