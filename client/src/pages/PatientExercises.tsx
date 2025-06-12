import React, { useEffect, useState } from 'react';
import styles from './PatientExercises.module.css';
import { getPatientExercises, completePatientExercise } from '../services/api';
import { PatientExercise } from '../types';
import { useAuth } from '../contexts/AuthContext';
import PatientExercisesWithHandCounter from './PatientExercisesWithHandCounter';

const PatientExercises: React.FC = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<PatientExercise[]>([]);
  const [filter, setFilter] = useState<'all' | 'assigned' | 'completed'>('all');
  const [loadingCompleteId, setLoadingCompleteId] = useState<string | null>(null);

  const loadExercises = () => {
    if (user?.role_id) {
      getPatientExercises(user.role_id)
        .then(setExercises)
        .catch((err) => console.error('Error fetching exercises:', err));
    }
  };

  useEffect(() => {
    loadExercises();
  }, [user]);

  const handleComplete = async (patientExerciseId: string) => {
    setLoadingCompleteId(patientExerciseId);
    try {
      // Mock completion data
      const completionData = {
        completed_date: new Date().toISOString().split('T')[0],
        sets_completed: 3,
        repetitions_completed: 10,
        duration_completed_seconds: 300,
        pain_level: 3,
        difficulty_rating: 4,
      };
      await completePatientExercise(patientExerciseId, completionData);
      loadExercises();
    } catch (error) {
      console.error('Error completing exercise:', error);
    } finally {
      setLoadingCompleteId(null);
    }
  };

  const filteredExercises =
    filter === 'all'
      ? exercises
      : exercises.filter((ex) => ex.status === filter);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>התרגילים שלי</h1>
        <p>כל התרגילים בתוכנית השיקום שלך</p>
      </div>

      <PatientExercisesWithHandCounter />

      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          הכל
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'assigned' ? styles.active : ''}`}
          onClick={() => setFilter('assigned')}
        >
          ממתין
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
          onClick={() => setFilter('completed')}
        >
          הושלם
        </button>
      </div>

      <div className={styles.exercisesList}>
        {filteredExercises.map((pe) => (
          <div key={pe.id} className={styles.exerciseCard}>
            <div className={styles.exerciseInfo}>
              <div className={styles.exerciseHeader}>
                <h3>{pe.exercise?.name}</h3>
                <span className={`${styles.status} ${styles[pe.status]}`}>
                  {pe.status === 'completed' ? 'הושלם' : 'ממתין'}
                </span>
              </div>
              {pe.status !== 'completed' && (
                <div className={styles.actions}>
                  <button
                    onClick={() => handleComplete(pe.id)}
                    className={styles.startButton}
                    disabled={loadingCompleteId === pe.id}
                  >
                    {loadingCompleteId === pe.id ? 'טוען...' : 'סמן כהושלם'}
                  </button>
                </div>
              )}
              <p>{pe.exercise?.description}</p>
              <div className={styles.exerciseDetails}>
                <span className={styles.duration}>{pe.duration_seconds} שניות</span>
                <span className={styles.repetitions}>{pe.repetitions} חזרות</span>
                <span className={styles.sets}>{pe.sets} סטים</span>
              </div>
              {pe.exercise?.instructions && (
                <p className={styles.instructions}>{pe.exercise.instructions}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientExercises;
