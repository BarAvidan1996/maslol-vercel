import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPatient,
  getPatientExercises,
  getExerciseLibrary,
  assignExercises,
  getPatientAppointments,
  deletePatientExercise
} from '../services/api';
import { Patient, PatientExercise, Exercise, Appointment } from '../types';
import styles from './PatientProfile.module.css';
import ReactModal from 'react-modal';
import { PlusIcon, UserCircleIcon, CalendarIcon, ClipboardDocumentListIcon, TrashIcon } from '@heroicons/react/24/outline';

const PatientProfile: React.FC = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Partial<PatientExercise>[]>([]);

  const { data: patient, isLoading: patientLoading } = useQuery<Patient>({
    queryKey: ['patient', patientId],
    queryFn: () => getPatient(patientId!),
    enabled: !!patientId,
  });

  const { data: assignedExercises, isLoading: exercisesLoading } = useQuery<PatientExercise[]>({
    queryKey: ['patientExercises', patientId],
    queryFn: () => getPatientExercises(patientId!),
    enabled: !!patientId,
  });
  
  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ['patientAppointments', patientId],
    queryFn: () => getPatientAppointments(patientId!),
    enabled: !!patientId,
  });

  const { data: exerciseLibrary } = useQuery<Exercise[]>({
    queryKey: ['exerciseLibrary'],
    queryFn: () => getExerciseLibrary(),
  });

  const deletePatientExerciseMutation = useMutation({
    mutationFn: deletePatientExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientExercises', patientId] });
    },
    onError: (error) => {
        console.error("Error deleting patient exercise:", error);
        alert("Failed to delete patient exercise.");
    }
  });

  const assignMutation = useMutation({
    mutationFn: (exercises: Partial<PatientExercise>[]) => assignExercises(patientId!, exercises),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientExercises', patientId] });
      setShowModal(false);
      setSelectedExercises([]);
    },
    onError: (error) => {
      console.error("Error assigning exercises", error);
      alert("Failed to assign exercises.");
    }
  });

  const handleDeleteExercise = (patientExerciseId: string) => {
    if (window.confirm('Are you sure you want to remove this exercise?')) {
        deletePatientExerciseMutation.mutate(patientExerciseId);
    }
  };

  const handleSelectExercise = (exercise: Exercise) => {
    const isSelected = selectedExercises.some(se => se.exercise_id === exercise.id);
    if (isSelected) {
      setSelectedExercises(prev => prev.filter(se => se.exercise_id !== exercise.id));
    } else {
      const newAssignment: Partial<PatientExercise> = {
        exercise_id: exercise.id,
        sets: exercise.default_sets,
        repetitions: exercise.default_repetitions,
        duration_seconds: exercise.default_duration_seconds,
        status: 'assigned',
        exercise,
      };
      setSelectedExercises(prev => [...prev, newAssignment]);
    }
  };

  const handleSaveAssignments = () => {
    const assignmentsToSave = selectedExercises.map(ex => ({
      exercise_id: ex.exercise_id,
      sets: ex.sets,
      repetitions: ex.repetitions,
      duration_seconds: ex.duration_seconds,
      frequency_per_week: 7,
    }));
    assignMutation.mutate(assignmentsToSave);
  };

  if (patientLoading || exercisesLoading || appointmentsLoading) return <div className={styles.loading}>טוען...</div>;
  if (!patient) return <div className={styles.error}>לא נמצא מטופל</div>;

  const upcomingAppointments = appointments?.filter(a => new Date(a.scheduled_date) >= new Date()) || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profileInfo}>
            <UserCircleIcon className={styles.avatar}/>
            <div className={styles.details}>
                <h1 className={styles.name}>{patient.user?.first_name} {patient.user?.last_name}</h1>
                <div className={styles.contactInfo}>
                    <span>{patient.user?.email}</span>
                    <span>{patient.user?.phone}</span>
                </div>
            </div>
        </div>
        <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={() => setShowModal(true)}>
                <PlusIcon className={styles.buttonIcon}/>
                הקצאת תרגילים
            </button>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}><ClipboardDocumentListIcon/> תרגילים שהוקצו</h2>
            <div className={styles.exerciseList}>
                {assignedExercises?.length === 0 && <p>לא הוקצו תרגילים</p>}
                {assignedExercises?.map(pe => (
                    <div key={pe.id} className={styles.exerciseCard}>
                        <div className={styles.exerciseInfo}>
                            <h4>{pe.exercise?.name}</h4>
                            <p>{pe.sets} סטים, {pe.repetitions} חזרות</p>
                        </div>
                        <div className={styles.exerciseActions}>
                            <span className={`${styles.status} ${styles[pe.status]}`}>{pe.status}</span>
                            <button onClick={() => handleDeleteExercise(pe.id)} className={styles.deleteButton}>
                                <TrashIcon/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}><CalendarIcon/> פגישות קרובות</h2>
            <div className={styles.appointmentList}>
                 {upcomingAppointments.length === 0 && <p>אין פגישות קרובות</p>}
                 {upcomingAppointments.map(app => (
                     <div key={app.id} className={styles.appointmentCard}>
                        <p>{new Date(app.scheduled_date).toLocaleDateString('he-IL')} - {app.scheduled_time}</p>
                        <span className={`${styles.status} ${styles[app.status]}`}>{app.status}</span>
                     </div>
                 ))}
            </div>
        </div>
      </div>


      <ReactModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="הקצאת תרגילים"
        className={styles.modal}
        overlayClassName={styles.overlay}
        ariaHideApp={false}
      >
        <h2 className={styles.modalTitle}>הקצאת תרגילים חדשים</h2>
        <div className={styles.modalContent}>
          <div className={styles.exerciseSelection}>
            <h3 className={styles.modalSubtitle}>מאגר תרגילים</h3>
            <div className={styles.libraryGrid}>
              {exerciseLibrary?.map((ex) => {
                  const isSelected = selectedExercises.some(se => se.exercise_id === ex.id);
                  return (
                    <div 
                        key={ex.id} 
                        className={`${styles.libraryCard} ${isSelected ? styles.selected : ''}`}
                        onClick={() => handleSelectExercise(ex)}
                    >
                      {ex.name}
                    </div>
                  )
                })}
            </div>
          </div>
          <div className={styles.selectedExercises}>
            <h3 className={styles.modalSubtitle}>תרגילים שנבחרו ({selectedExercises.length})</h3>
            <div className={styles.selectionList}>
                {selectedExercises.length === 0 && <p>בחר תרגילים מהמאגר</p>}
                {selectedExercises.map((se, index) => (
                    <div key={index} className={styles.selectedCard}>
                        <span>{se.exercise?.name}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
        <div className={styles.modalActions}>
            <button className={styles.saveButton} onClick={handleSaveAssignments} disabled={assignMutation.isPending || selectedExercises.length === 0}>
            {assignMutation.isPending ? 'מקצה...' : 'שמור הקצאה'}
            </button>
            <button className={styles.cancelButton} onClick={() => setShowModal(false)}>ביטול</button>
        </div>
      </ReactModal>
    </div>
  );
};

export default PatientProfile;
