import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';
import initDatabase from './config/init';

// Import routes
import authRoutes from './routes/auth';
import exercisesRoutes from './routes/exercises';
import appointmentsRoutes from './routes/appointments';
import patientsRoutes from './routes/patients';
import therapistsRoutes from './routes/therapists';
//import patientExercisesRoutes from './routes/patientExercises';

// Load environment variables
dotenv.config();

const app = express();
const port = 8080;  // Fixed syntax for port number

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://rehabilitation-system-client.onrender.com',
        'https://rehabilitation-system.onrender.com'
      ]
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/therapists', therapistsRoutes);
//app.use('/api/patient-exercises', patientExercisesRoutes);

// Health check route for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync database models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database models synchronized successfully.');

    // Initialize database with seed data
    await initDatabase();
    console.log('Database seeded successfully.');

    // Start listening
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();
