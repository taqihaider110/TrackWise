const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file
const open = require('open').default;  // Correct import for open package

// Import the connectDB function to establish the database connection
const { connectDB } = require('./config/db');

// Swagger setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Initialize Express app
const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json());  // Parse incoming JSON requests

// Swagger documentation setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI-Driven Finance Tracker API',
      version: '1.0.0',
      description: 'API documentation for AI-Driven Personal Finance Tracker',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Bearer token for API requests
        },
      },
    },
  },
  apis: ['./routes/*.js'],  // Path to your route files for documentation
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test Route
app.get('/', (req, res) => {
  res.send('Welcome to AI-Driven Finance Tracker API!');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const landingRoutes = require('./routes/landingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const profileRoutes = require('./routes/profileRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

// API Routes with versioning
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/landing', landingRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/incomes', incomeRoutes);
app.use('/api/v1/predictions', predictionRoutes);

// Database Connection (Ensure DB is connected before starting the server)
connectDB()
  .then(() => {
    // Start the server
    const server = app.listen(process.env.PORT || 5000, async () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
  
      // Automatically open the Swagger UI in the browser
      await open('http://localhost:5000/api-docs');
    });
  
    // Graceful shutdown - Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      server.close(() => {
        console.log('Server terminated');
      });
    });
  
    // Graceful shutdown - Handle SIGTERM (e.g., Docker/Kubernetes termination)
    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Server terminated due to SIGTERM');
      });
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);  // Exit if DB connection fails
  });

// Catch-all Error Handling (Async errors)
app.use((err, req, res, next) => {
  console.error('Error:', err);  // Log the error for debugging
  const statusCode = err.statusCode || 500;  // Default to 500 if no status code set
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,  // Show stack trace only in development
  });
});
