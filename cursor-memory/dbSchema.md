# Database Schema (MySQL via cPanel)

**Database Name**: `rehabilitation_db`  
**Backend Access**: Node.js + `mysql2`  
**Managed via**: cPanel

---

## 📋 Tables Overview

### `patients`
Stores patient personal info and medical history.

| Field | Type | Notes |
|-------|------|-------|
| id | INT (PK) | Auto-increment |
| first_name, last_name | VARCHAR | Required |
| email | VARCHAR | Unique |
| date_of_birth | DATE |  |
| phone, address | TEXT/VARCHAR |  |
| medical_history | TEXT | Optional |
| created_at, updated_at | TIMESTAMP | Auto-managed |

---

### `therapists`
Therapist info, specializations, and calendar connection.

| Field | Type | Notes |
|-------|------|-------|
| id | INT (PK) |  |
| first_name, last_name | VARCHAR |  |
| email, phone | VARCHAR | Unique email |
| license_number | VARCHAR | Unique |
| specialization, working_hours | JSON | |
| google_calendar_id | VARCHAR | Optional |

---

### `therapist_patient_relations`
Links therapists and patients with relationship metadata.

| Field | Type | Notes |
|-------|------|-------|
| therapist_id, patient_id | INT (FK) | Composite PK |
| status | ENUM | 'active', 'completed', 'on-hold' |
| notes, start_date, end_date | TEXT/DATE |  |

---

### `rehab_plans`
Rehabilitation plan assigned to patients.

| Field | Type | Notes |
|-------|------|-------|
| id | INT (PK) |  |
| patient_id, therapist_id | INT (FK) |  |
| title, description | VARCHAR/TEXT |  |
| status | ENUM | 'active', 'completed', 'on-hold' |

---

### `rehab_goals`
Goals inside a rehab plan with progress tracking.

| Field | Type | Notes |
|-------|------|-------|
| plan_id | INT (FK) |  |
| title, description | VARCHAR |  |
| measurement_criteria | TEXT |  |
| progress | INT | Percent |
| status | ENUM | 'pending', 'in-progress', 'achieved' |

---

### `equipment`
List of equipment including Yad Sarah availability.

| Field | Type | Notes |
|-------|------|-------|
| name, description | VARCHAR/TEXT |  |
| category | VARCHAR |  |
| yad_sara_location | JSON | Geolocated branch info |

---

### `exercises`
Exercise library with videos, difficulty, and instructions.

| Field | Type | Notes |
|-------|------|-------|
| name | VARCHAR |  |
| video_url, instructions | TEXT |  |
| duration | INT | In minutes |
| repetitions, sets | INT | Optional |
| difficulty | ENUM | 'beginner', 'intermediate', 'advanced' |

---

### `exercise_equipment`
Many-to-many between `exercises` and `equipment`.

| Field | Type | Notes |
|-------|------|-------|
| exercise_id, equipment_id | INT (FK) | Composite PK |

---

### `appointments`
Scheduled sessions linked to Google Calendar.

| Field | Type | Notes |
|-------|------|-------|
| patient_id, therapist_id, plan_id | INT (FK) |  |
| start_time, end_time | DATETIME |  |
| type | ENUM | 'session', 'exercise', 'evaluation' |
| reminder_time | ENUM | '30min', '1hour', '1day' |
| location | VARCHAR |  |

---

### `exercise_sessions`
Logs of performed exercises with feedback and AI-tracked performance.

| Field | Type | Notes |
|-------|------|-------|
| appointment_id, exercise_id, patient_id | INT (FK) |  |
| performance | JSON | Pose tracking results |
| feedback | JSON | Optional |
| completed | BOOLEAN |  |

---

## 🔗 Notes
- All foreign key constraints are enforced for relational consistency.
- The database schema supports many-to-many patient-therapist mapping and dynamic plan creation.
- Performance and feedback are recorded per session via AI-based tracking.
