-- Drop tables (use lowercase matching the create)
DROP TABLE IF EXISTS exercise_sessions;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS rehab_goals;
DROP TABLE IF EXISTS rehab_plans;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS therapists;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  role ENUM('patient', 'therapist') NOT NULL,
  phoneNumber VARCHAR(20),
  dateOfBirth DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create therapists table
CREATE TABLE therapists (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL UNIQUE,
  specialization VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_therapists_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create patients table
CREATE TABLE patients (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  therapistId VARCHAR(36),
  patient_condition TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_patients_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_patients_therapist FOREIGN KEY (therapistId) REFERENCES therapists(id) ON DELETE SET NULL
);

-- Create equipment table
CREATE TABLE equipment (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  yadSaraLocation JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create exercises table
CREATE TABLE exercises (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  videoUrl VARCHAR(255),
  instructions TEXT,
  duration INT,
  repetitions INT,
  sets INT,
  difficulty ENUM('beginner', 'intermediate', 'advanced'),
  type ENUM('squat', 'plank', 'pushup', 'other'),
  category ENUM('core', 'upper', 'lower', 'full'),
  isCompleted BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'completed') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create rehab_plans table
CREATE TABLE rehab_plans (
  id VARCHAR(36) PRIMARY KEY,
  patientId VARCHAR(36) NOT NULL,
  therapistId VARCHAR(36) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  status ENUM('active', 'completed', 'on-hold') DEFAULT 'active',
  progress INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (therapistId) REFERENCES therapists(id) ON DELETE CASCADE
);

-- Create rehab_goals table
CREATE TABLE rehab_goals (
  id VARCHAR(36) PRIMARY KEY,
  planId VARCHAR(36) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  targetDate DATE NOT NULL,
  status ENUM('pending', 'in-progress', 'achieved') DEFAULT 'pending',
  measurementCriteria TEXT,
  progress INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (planId) REFERENCES rehab_plans(id) ON DELETE CASCADE
);

-- Create appointments table
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  patientId VARCHAR(36) NOT NULL,
  therapistId VARCHAR(36) NOT NULL,
  planId VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type ENUM('initial', 'follow-up', 'exercise') NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  notes TEXT,
  location VARCHAR(255),
  reminderTime ENUM('30min', '1hour', '1day'),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (therapistId) REFERENCES therapists(id) ON DELETE CASCADE,
  FOREIGN KEY (planId) REFERENCES rehab_plans(id) ON DELETE CASCADE
);

-- Create exercise_sessions table
CREATE TABLE exercise_sessions (
  id VARCHAR(36) PRIMARY KEY,
  appointmentId VARCHAR(36) NOT NULL,
  patientId VARCHAR(36) NOT NULL,
  exerciseId VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME,
  completed BOOLEAN DEFAULT FALSE,
  performance JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (exerciseId) REFERENCES exercises(id) ON DELETE CASCADE
);
