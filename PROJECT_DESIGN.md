# Rehabilitation System - Project Design Document

## 📋 Overview
A rehabilitation and physiotherapy management system enabling therapists to create treatment plans, monitor patient progress, and manage appointments. **This is a simplified MVP focused on core functionality without camera/video features or external integrations.**

---

## 🎯 Project Goals & Vision - **SIMPLIFIED MVP**

### Primary Objectives (MVP Scope)
- [ ] Enable therapists to manage patients and create basic rehabilitation plans
- [ ] Allow patients to view assigned exercises and log completion
- [ ] Basic progress tracking through manual entry
- [ ] Simple appointment scheduling system
- [ ] Basic communication between therapists and patients

### Success Metrics (MVP)
- System functionality and usability
- User registration and authentication working
- Basic patient-therapist workflow operational
- Simple progress tracking capabilities

### **EXCLUDED FROM MVP:**
- ❌ Pose detection and camera integration
- ❌ Real-time video feedback
- ❌ Google Calendar API integration
- ❌ Advanced analytics and reporting
- ❌ Automated exercise modifications
- ❌ Real-time communication features

---

## 👥 User Personas & Workflows - **SIMPLIFIED**

### 🩺 Therapist Persona
**Role**: Licensed physiotherapist managing multiple patients

#### **Primary Workflow (MVP):**
1. **Patient Management**
   - Register new patients manually
   - View patient list and basic info
   - Assign exercises to patients

2. **Simple Treatment Planning**
   - Create basic rehab plans with exercise lists
   - Set exercise parameters (sets, reps, duration)
   - Mark exercises as assigned

3. **Basic Appointment Management**
   - Schedule appointments manually
   - View appointment calendar
   - Add session notes

4. **Simple Progress Review**
   - View patient exercise completion status
   - Read patient-reported feedback
   - Update exercise assignments

#### **Key Pain Points Addressed (MVP):**
- Manual patient record management
- Basic exercise assignment tracking
- Simple appointment organization

---

### 🏃 Patient Persona
**Role**: Individual receiving rehabilitation treatment

#### **Primary Workflow (MVP):**
1. **Simple Onboarding**
   - Register and login
   - View assigned exercises
   - Understand basic goals

2. **Manual Exercise Logging**
   - View today's assigned exercises
   - Read exercise instructions (text-based)
   - Mark exercises as completed
   - Log basic feedback (pain level, difficulty)

3. **Basic Progress View**
   - See completion percentage
   - View exercise history
   - Check upcoming appointments

4. **Simple Communication**
   - View appointment schedule
   - Add notes for therapist

#### **Key Pain Points Addressed (MVP):**
- Clear exercise assignments
- Simple completion tracking
- Basic therapist communication

---

## 📱 Application Pages & Data Requirements - **SIMPLIFIED**

### 🩺 Therapist Pages (MVP)

#### **1. Therapist Dashboard**
**Purpose**: Simple overview of patients and appointments

**Data Required:**
- Total active patients count
- Today's appointments list
- Recent patient exercise completions
- Quick links to patient management

**API Endpoints Needed:**
- `GET /api/therapists/{id}/dashboard-stats` (provides patient count and recent activity)
- `GET /api/therapists/{id}/appointments/today`

#### **2. Patients List**
**Purpose**: View and manage all assigned patients

**Data Required:**
- Patient list with basic info (name, last activity)
- Active exercise assignments per patient
- Simple status indicators (active/inactive)

**API Endpoints Needed:**
- `GET /api/therapists/{id}/patients`

#### **3. Patient Profile (Simplified)**
**Purpose**: Basic view of individual patient

**Data Required:**
- Patient contact information
- Current active exercises
- Exercise completion history
- Appointment history

**API Endpoints Needed:**
- `GET /api/patients/{id}`
- `GET /api/patients/{id}/exercises`
- `GET /api/patients/{id}/appointments`
- `GET /api/patients/{id}/exercise-completions`

#### **4. Exercise Assignment**
**Purpose**: Assign exercises to patients

**Data Required:**
- Simple exercise library (text instructions only)
- Patient exercise assignment interface
- Basic exercise parameters (sets, reps, frequency)

**API Endpoints Needed:**
- `GET /api/exercises/library`
- `POST /api/patients/{id}/assign-exercises`
- `GET /api/patients/{id}/exercises`
- `PUT /api/patient-exercises/{id}`
- `DELETE /api/patient-exercises/{id}`

#### **5. Simple Appointments**
**Purpose**: Basic appointment management

**Data Required:**
- Simple calendar view
- Appointment creation form
- Basic session notes

**API Endpoints Needed:**
- `GET /api/therapists/{id}/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/{id}`
- `PUT /api/appointments/{id}/notes`
- `DELETE /api/appointments/{id}`

---

### 🏃 Patient Pages (MVP)

#### **1. Patient Dashboard**
**Purpose**: Simple overview of assigned tasks

**Data Required:**
- Today's assigned exercises
- Overall completion progress
- Next appointment info
- Recent achievements (basic counters)

**API Endpoints Needed:**
- `GET /api/patients/{id}/dashboard`
- `GET /api/patients/{id}/exercises/today`

#### **2. My Exercises (Simplified)**
**Purpose**: View and complete assigned exercises

**Data Required:**
- Exercise list with text instructions
- Completion status checkboxes
- Basic feedback form (pain level 1-10, notes)
- Exercise history

**API Endpoints Needed:**
- `GET /api/patients/{id}/exercises`
- `POST /api/patient-exercises/{id}/complete`
- `GET /api/patients/{id}/exercise-completions`

#### **3. My Progress (Basic)**
**Purpose**: Simple progress tracking

**Data Required:**
- Exercise completion percentages
- Weekly/monthly completion charts (simple)
- Achievement milestones (basic counters)

**API Endpoints Needed:**
- `GET /api/patients/{id}/progress`

#### **4. My Appointments**
**Purpose**: View scheduled appointments

**Data Required:**
- Upcoming appointments list
- Appointment history
- Basic notes from therapist

**API Endpoints Needed:**
- `GET /api/patients/{id}/appointments`

---

## 🗄️ Database Schema Design - **SIMPLIFIED**

### **Core Entities (MVP)**

#### **Users Table** (Authentication Base)
\`\`\`sql
Users {
  id: UUID (PK)
  email: VARCHAR(255) UNIQUE
  password_hash: VARCHAR(255)
  first_name: VARCHAR(100)
  last_name: VARCHAR(100)
  phone: VARCHAR(20)
  role: ENUM('therapist', 'patient')
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
\`\`\`

#### **Therapists Table** (Role-specific data)
\`\`\`sql
Therapists {
  id: UUID (PK)
  user_id: UUID (FK -> Users.id) UNIQUE
  specialization: VARCHAR(100)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
\`\`\`

#### **Patients Table** (Role-specific data)
\`\`\`sql
Patients {
  id: UUID (PK)
  user_id: UUID (FK -> Users.id) UNIQUE
  therapist_id: UUID (FK -> Therapists.id)
  date_of_birth: DATE
  condition: VARCHAR(200)
  status: ENUM('active', 'inactive')
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
\`\`\`

#### **Exercises Table** (Exercise Library)
\`\`\`sql
Exercises {
  id: UUID (PK)
  name: VARCHAR(200)
  description: TEXT
  instructions: TEXT
  category: VARCHAR(100)
  difficulty_level: ENUM('beginner', 'intermediate', 'advanced')
  default_sets: INTEGER
  default_repetitions: INTEGER
  default_duration_seconds: INTEGER
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
\`\`\`

#### **Patient Exercises Table** (Assignment tracking)
\`\`\`sql
PatientExercises {
  id: UUID (PK)
  patient_id: UUID (FK -> Patients.id)
  exercise_id: UUID (FK -> Exercises.id)
  assigned_date: DATE
  assigned_by_therapist_id: UUID (FK -> Therapists.id)
  sets: INTEGER
  repetitions: INTEGER
  duration_seconds: INTEGER
  frequency_per_week: INTEGER
  status: ENUM('assigned', 'active', 'completed', 'paused')
  notes: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
\`\`\`

#### **Exercise Completions Table** (Performance logging)
\`\`\`sql
ExerciseCompletions {
  id: UUID (PK)
  patient_exercise_id: UUID (FK -> PatientExercises.id)
  completed_date: DATE
  sets_completed: INTEGER
  repetitions_completed: INTEGER
  duration_completed_seconds: INTEGER
  pain_level: INTEGER (1-10)
  difficulty_rating: INTEGER (1-5)
  notes: TEXT
  created_at: TIMESTAMP
}
\`\`\`

#### **Appointments Table** (Scheduling)
\`\`\`sql
Appointments {
  id: UUID (PK)
  patient_id: UUID (FK -> Patients.id)
  therapist_id: UUID (FK -> Therapists.id)
  scheduled_date: DATE
  scheduled_time: TIME
  duration_minutes: INTEGER DEFAULT 60
  type: ENUM('consultation', 'follow_up', 'assessment')
  status: ENUM('scheduled', 'completed', 'cancelled')
  session_notes: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
\`\`\`

---

## 🔌 API Architecture - **SIMPLIFIED MVP**

### **Core API Routes (MVP)**

#### **Authentication Routes**
\`\`\`
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
\`\`\`

#### **Therapist Routes**
\`\`\`
GET    /api/therapists/{id}
GET    /api/therapists/{id}/patients
GET    /api/therapists/{id}/dashboard-stats
GET    /api/therapists/{id}/appointments
GET    /api/therapists/{id}/appointments/today
\`\`\`

#### **Patient Routes**
\`\`\`
GET    /api/patients/{id}
GET    /api/patients/{id}/dashboard
GET    /api/patients/{id}/exercises
GET    /api/patients/{id}/exercises/today
GET    /api/patients/{id}/exercise-completions
GET    /api/patients/{id}/appointments
GET    /api/patients/{id}/progress
POST   /api/patients
PUT    /api/patients/{id}
\`\`\`

#### **Exercise Routes**
\`\`\`
GET    /api/exercises/library
GET    /api/exercises/{id}
POST   /api/exercises
PUT    /api/exercises/{id}
DELETE /api/exercises/{id}
\`\`\`

#### **Patient Exercise Assignment Routes**
\`\`\`
GET    /api/patients/{id}/exercises
POST   /api/patients/{id}/assign-exercises
GET    /api/patient-exercises/{id}
PUT    /api/patient-exercises/{id}
DELETE /api/patient-exercises/{id}
POST   /api/patient-exercises/{id}/complete
\`\`\`

#### **Exercise Completion Routes**
\`\`\`
GET    /api/exercise-completions/{id}
PUT    /api/exercise-completions/{id}
\`\`\`

#### **Appointment Routes**
\`\`\`
GET    /api/appointments
POST   /api/appointments
GET    /api/appointments/{id}
PUT    /api/appointments/{id}
DELETE /api/appointments/{id}
PUT    /api/appointments/{id}/notes
\`\`\`

---

## 🔧 Data Flow & Business Logic

### **User Registration & Authentication Flow**
1. User registers with role (therapist/patient)
2. `Users` record created
3. Role-specific record created (`Therapists` or `Patients`)
4. Login returns both User ID and role-specific ID
5. Frontend uses role-specific ID for API calls

### **Patient Assignment Flow**
1. Therapist creates patient (if registering on behalf)
2. Patient record linked to therapist
3. Therapist can view patient in their patients list

### **Exercise Assignment Flow**
1. Therapist selects exercises from library
2. Creates `PatientExercises` records with parameters
3. Patient can view assigned exercises
4. Patient completes exercises, creates `ExerciseCompletions`

### **Progress Tracking Flow**
1. Aggregate `ExerciseCompletions` by patient
2. Calculate completion rates and trends
3. Display progress metrics to both therapist and patient

---

## 🔧 Technical Implementation Plan - **MVP FOCUSED**

### **Phase 1: Core MVP (IMMEDIATE FOCUS)**
**Goal**: Get basic system working with essential features only

**Deliverables:**
- [ ] **Fix current authentication issues**
- [ ] **Resolve User ID → Therapist/Patient ID mapping**
- [ ] Basic therapist dashboard (patient count, appointments)
- [ ] Basic patient dashboard (assigned exercises, progress)
- [ ] Simple exercise library and assignment system
- [ ] Basic appointment scheduling (no external calendar)
- [ ] Simple exercise completion logging

**Priority Order:**
1. Fix authentication and ID mapping issues
2. Implement missing API endpoints
3. Therapist dashboard with patient list
4. Patient dashboard with exercise list
5. Exercise assignment and completion
6. Basic appointment management

### **Database Setup Requirements:**
- [ ] Update existing models to match new schema
- [ ] Create seed data for exercises library
- [ ] Set up proper foreign key relationships
- [ ] Add validation rules

### **API Implementation Requirements:**
- [ ] Implement all missing endpoints listed above
- [ ] Add proper error handling and validation
- [ ] Ensure consistent response formats
- [ ] Add authentication middleware to protected routes

### **Frontend Updates Requirements:**
- [ ] Fix authentication context to handle role-specific IDs
- [ ] Update all components to use correct API endpoints
- [ ] Implement proper error handling and loading states
- [ ] Create simple, functional UI for all features

---

## ❓ Immediate Issues to Resolve

### **1. Current Blocking Issues**
- [ ] **CRITICAL**: Fix User ID → Therapist/Patient ID mapping in authentication
- [ ] **CRITICAL**: Implement missing API endpoints
- [ ] **HIGH**: Update registration to return proper role-specific IDs
- [ ] **HIGH**: Fix TherapistDashboard to use correct therapist ID

### **2. Missing API Endpoints to Implement**
- [ ] `GET /api/therapists/{id}/patients`
- [ ] `GET /api/therapists/{id}/dashboard-stats`
- [ ] `GET /api/patients/{id}/exercises/today`
- [ ] `POST /api/patients/{id}/assign-exercises`
- [ ] `POST /api/patient-exercises/{id}/complete`
- [ ] `GET /api/patients/{id}/progress`

### **3. Database Schema Updates Needed**
- [ ] Add `assigned_by_therapist_id` to `PatientExercises`
- [ ] Ensure `user_id` fields are UNIQUE in `Therapists` and `Patients`
- [ ] Create proper indexes for performance
- [ ] Add sample exercise data
- [ ] Document the creation of 20 mock patients for the therapist with the email 'gonbp9@gmail.com'

---

## 🚀 Next Steps - **IMMEDIATE ACTION PLAN**

### **Priority 1: Fix Current Issues**
1. **Fix authentication ID mapping** - Make registration return therapist/patient IDs
2. **Implement missing API endpoints** - Add all endpoints listed above
3. **Update frontend to use correct IDs** - Fix dashboard data fetching

### **Priority 2: Complete MVP Core Features**
1. **Therapist dashboard** - Show patients and basic stats
2. **Patient dashboard** - Show assigned exercises
3. **Exercise system** - Assignment and completion tracking
4. **Basic appointments** - Simple scheduling without external calendar

### **Priority 3: Testing & Polish**
1. **Create sample data** - Exercises, patients, appointments
2. **Test full workflow** - Therapist assigns exercise → Patient completes
3. **Fix UI/UX issues** - Ensure smooth user experience

---

**FOCUS**: Get the basic patient-therapist workflow operational without any advanced features.

*Last Updated: [Current Date]*
*Status: MVP Scope Defined - Ready for Implementation*
