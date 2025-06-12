// Exercise Session Performance Type
export interface ExercisePerformance {
  accuracy: number; // 0-100%
  correctPosture: boolean;
  completedRepetitions: number;
  completedSets: number;
  notes: string;
  mediaUrl?: string; // URL to recorded session
}

// Exercise Session Feedback Type
export interface ExerciseFeedback {
  issues: string[];
  recommendations: string[];
  sentToTherapist: boolean;
  therapistResponse?: string;
}

// Yad Sara Location Type
export interface YadSaraLocation {
  branchId: number;
  branchName: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  availability: boolean;
}

// Exercise Session Type
export interface ExerciseSessionType {
  id: string;
  appointmentId: string;
  patientId: string;
  exerciseId: string;
  date: Date;
  startTime: string;
  endTime?: string;
  completed: boolean;
  performance?: ExercisePerformance;
  feedback?: ExerciseFeedback;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment Type
export interface AppointmentType {
  id: string;
  patientId: string;
  therapistId: string;
  planId: string;
  date: Date;
  time: string;
  type: 'initial' | 'follow-up' | 'exercise';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  location?: string;
  reminderTime?: '30min' | '1hour' | '1day';
  createdAt: Date;
  updatedAt: Date;
}

// Rehab Plan Type
export interface RehabPlanType {
  id: string;
  patientId: string;
  therapistId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// Rehab Goal Type
export interface RehabGoalType {
  id: string;
  planId: string;
  title: string;
  description?: string;
  targetDate: Date;
  status: 'pending' | 'in-progress' | 'achieved';
  measurementCriteria?: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// Exercise Type
export interface ExerciseType {
  id: string;
  name: string;
  description?: string;
  videoUrl?: string;
  instructions?: string;
  duration?: number;
  repetitions?: number;
  sets?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  type?: 'squat' | 'plank' | 'pushup' | 'other';
  category?: 'core' | 'upper' | 'lower' | 'full';
  isCompleted: boolean;
  status: 'pending' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// Equipment Type
export interface EquipmentType {
  id: string;
  name: string;
  description?: string;
  category?: string;
  yadSaraLocation?: YadSaraLocation;
  createdAt: Date;
  updatedAt: Date;
}

// Patient Type
export interface PatientType {
  id: string;
  userId: string;
  therapistId?: string;
  condition?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Therapist Type
export interface TherapistType {
  id: string;
  userId: string;
  specialization?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Type
export interface UserType {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'therapist';
  phoneNumber?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
}
