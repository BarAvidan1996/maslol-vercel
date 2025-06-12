export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'therapist' | 'patient';
  created_at: string;
  updated_at: string;
}

export interface Therapist {
  id: string;
  user_id: string;
  specialization: string;
  user?: User;
  patients?: Patient[];
}

export interface Patient {
  id: string;
  user_id: string;
  therapist_id: string;
  date_of_birth: string;
  condition: string;
  status: 'active' | 'inactive';
  user?: User;
  therapist?: Therapist;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  default_sets: number;
  default_repetitions: number;
  default_duration_seconds: number;
  video_url?: string;
  youtube_link?: string;
}

export interface PatientExercise {
  id: string;
  patient_id: string;
  exercise_id: string;
  assigned_date: string;
  assigned_by_therapist_id: string;
  sets: number;
  repetitions: number;
  duration_seconds: number;
  frequency_per_week: number;
  status: 'assigned' | 'active' | 'completed' | 'paused';
  notes?: string;
  exercise?: Exercise;
}

export interface ExerciseCompletion {
  id: string;
  patient_exercise_id: string;
  completed_date: string;
  sets_completed: number;
  repetitions_completed: number;
  duration_completed_seconds: number;
  pain_level: number;
  difficulty_rating: number;
  notes?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  therapist_id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  type: 'consultation' | 'follow_up' | 'assessment';
  status: 'scheduled' | 'completed' | 'cancelled';
  session_notes?: string;
  patient?: Patient;
  therapist?: Therapist;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: 'therapist' | 'patient';
    specialization?: string;
    therapist_id?: string;
    date_of_birth?: string;
    condition?: string;
}
