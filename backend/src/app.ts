import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import medicineRoutes from './routes/medicine.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP specifically for Swagger UI to load assets correctly
}));

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger JSDoc Setup
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pharmacy App API',
      version: '1.0.0',
      description: 'REST API documentation for the Pharmacy Application',
      contact: {
        name: 'Developer Support'
      }
    },
    servers: [
      {
        url: process.env.BACKEND_URL || 'http://localhost:5000',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base Route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the Pharmacy App REST API. Swagger documentation is available at /api-docs',
    docs: '/api-docs'
  });
});

// App Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);

// Error Handler Middleware
app.use(errorHandler);

export default app;
