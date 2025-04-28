const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const open = require('open').default; // To open Swagger UI in browser

const { connectDB } = require('./config/db'); // DB connection

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`🔧 Running in ${NODE_ENV.toUpperCase()} mode`);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger setup
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
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to AI-Driven Finance Tracker API!');
});

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/landing', require('./routes/landingRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/v1/profile', require('./routes/profileRoutes'));
app.use('/api/v1/expenses', require('./routes/expenseRoutes'));
app.use('/api/v1/incomes', require('./routes/incomeRoutes'));
// app.use('/api/v1/predictions', require('./routes/predictionRoutes'));

// Connect to DB and start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, async () => {
      console.log(`✅ Server running on port ${PORT}`);

      // Always open Swagger UI in browser
      const swaggerURL = `http://localhost:${PORT}/api-docs`;
      console.log(`🔍 Opening Swagger UI at ${swaggerURL}`);
      await open(swaggerURL);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      server.close(() => {
        console.log('🛑 Server terminated via SIGINT');
      });
    });

    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('🛑 Server terminated via SIGTERM');
      });
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to the database:', err);
    process.exit(1);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
  });
});
