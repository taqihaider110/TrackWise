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

// ------------------------
// 🛡️ CORS Setup
// ------------------------
const allowedOrigins = [
  process.env.CORS_ORIGIN, // Production frontend
  'http://localhost:3000', // Local frontend (development)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ------------------------
// 📦 Middleware
// ------------------------
app.use(express.json());

// ------------------------
// 📄 Swagger setup
// ------------------------
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

// ------------------------
// 🏠 Root route
// ------------------------
app.get('/', (req, res) => {
  res.send('Welcome to AI-Driven Finance Tracker API!');
});

// ------------------------
// 🚀 API Routes
// ------------------------
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/landing', require('./routes/landingRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/v1/profile', require('./routes/profileRoutes'));
app.use('/api/v1/expenses', require('./routes/expenseRoutes'));
app.use('/api/v1/incomes', require('./routes/incomeRoutes'));
// app.use('/api/v1/predictions', require('./routes/predictionRoutes'));

// ------------------------
// 🔗 Connect to DB and Start server
// ------------------------
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

// ------------------------
// ⚡ Global Error Handler
// ------------------------
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
  });
});
