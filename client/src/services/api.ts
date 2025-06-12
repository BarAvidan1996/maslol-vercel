/// <reference types="vite/client" />
import axios from 'axios';
import { 
    Patient, Therapist, Exercise, 
    PatientExercise, ExerciseCompletion, Appointment, 
    LoginData, RegisterData 
} from '../types';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://rehabilitation-system-server.onrender.com/api'
  : 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data: RegisterData) => api.post('/auth/register', data).then(res => res.data);
export const login = (data: LoginData) => api.post('/auth/login', data).then(res => res.data);
export const getMe = () => api.get('/auth/me').then(res => res.data);


// Therapists
export const getTherapist = (id: string): Promise<Therapist> => api.get(`/therapists/${id}`).then(res => res.data);
export const getTherapistPatients = (id: string): Promise<Patient[]> => api.get(`/therapists/${id}/patients`).then(res => res.data);
export const getTherapistDashboardStats = (id: string): Promise<any> => api.get(`/therapists/${id}/dashboard-stats`).then(res => res.data);
export const getTherapistAppointments = (id: string): Promise<Appointment[]> => api.get(`/therapists/${id}/appointments`).then(res => res.data);
export const getTherapistAppointmentsToday = (id: string): Promise<Appointment[]> => api.get(`/therapists/${id}/appointments/today`).then(res => res.data);


// Patients
export const getPatient = (id: string): Promise<Patient> => api.get(`/patients/${id}`).then(res => res.data);
export const updatePatient = (id: string, data: Partial<Patient>): Promise<Patient> => api.put(`/patients/${id}`, data).then(res => res.data);
export const getPatientDashboard = (id: string) => api.get(`/patients/${id}/dashboard`).then(res => res.data);
export const getPatientExercises = (id: string): Promise<PatientExercise[]> => api.get(`/patients/${id}/exercises`).then(res => res.data);
export const getPatientExercisesToday = (id: string): Promise<PatientExercise[]> => api.get(`/patients/${id}/exercises/today`).then(res => res.data);
export const assignExercises = (patientId: string, exercises: Partial<PatientExercise>[]): Promise<PatientExercise[]> => api.post(`/patients/${patientId}/assign-exercises`, { exercises }).then(res => res.data);
export const getPatientExerciseCompletions = (id: string): Promise<ExerciseCompletion[]> => api.get(`/patients/${id}/exercise-completions`).then(res => res.data);
export const getPatientAppointments = (id: string): Promise<Appointment[]> => api.get(`/patients/${id}/appointments`).then(res => res.data);
export const getPatientProgress = (id: string) => api.get(`/patients/${id}/progress`);
export const unassignPatient = (id: string): Promise<Patient> => api.put(`/patients/${id}`, { therapist_id: null });
export const deletePatient = (id: string): Promise<void> => api.delete(`/patients/${id}`);


// Exercises (Library)
export const getExerciseLibrary = (): Promise<Exercise[]> => api.get('/exercises/library').then(res => res.data);
export const getExercise = (id: string): Promise<Exercise> => api.get(`/exercises/${id}`).then(res => res.data);
export const createExercise = (data: Partial<Exercise>): Promise<Exercise> => api.post('/exercises', data).then(res => res.data);
export const updateExercise = (id: string, data: Partial<Exercise>): Promise<Exercise> => api.put(`/exercises/${id}`, data).then(res => res.data);
export const deleteExercise = (id: string): Promise<void> => api.delete(`/exercises/${id}`);


// Exercise Video
export const updateExerciseVideo = (data: { exerciseId: string; video?: FormData; youtubeLink?: string }): Promise<Exercise> => {
  if (data.video) {
    return api.post(`/exercises/${data.exerciseId}/video`, data.video, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  } else if (data.youtubeLink) {
    return api.put(`/exercises/${data.exerciseId}/video`, { youtube_link: data.youtubeLink }).then(res => res.data);
  }
  throw new Error('Either video or youtubeLink must be provided');
};


// Patient Exercises
export const completePatientExercise = (id: string, completionData: any): Promise<ExerciseCompletion> => api.post(`/patient-exercises/${id}/complete`, completionData).then(res => res.data);
export const deletePatientExercise = (id: string): Promise<void> => api.delete(`/patient-exercises/${id}`);


// Exercise Completions
export const getExerciseCompletions = (patientId: string): Promise<ExerciseCompletion[]> => api.get(`/patients/${patientId}/exercise-completions`).then(res => res.data);


// Appointments
export const getAppointments = (): Promise<Appointment[]> => api.get('/appointments').then(res => res.data);
export const getAppointment = (id: string): Promise<Appointment> => api.get(`/appointments/${id}`).then(res => res.data);
export const createAppointment = (data: Partial<Appointment>): Promise<Appointment> => api.post('/appointments', data).then(res => res.data);
export const updateAppointment = (id: string, data: Partial<Appointment>): Promise<Appointment> => api.put(`/appointments/${id}`, data).then(res => res.data);
export const deleteAppointment = (id: string): Promise<void> => api.delete(`/appointments/${id}`);
export const updateAppointmentNotes = (id: string, notes: string): Promise<Appointment> => api.put(`/appointments/${id}/notes`, { session_notes: notes }).then(res => res.data);


export default api;
