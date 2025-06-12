import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PatientDashboard.module.css';
import { ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { getPatientDashboard } from '../services/api';
import { PatientExercise, Appointment } from '../types';
import { useAuth } from '../contexts/AuthContext';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const patientId = user?.role_id;

  const [dashboardData, setDashboardData] = useState<{ todaysExercises: PatientExercise[], nextAppointment: Appointment | null }>({ todaysExercises: [], nextAppointment: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
        try {
            const response = await getPatientDashboard(patientId);
            setDashboardData(response);
        } catch (err) {
            console.error('Error fetching patient dashboard:', err);
            setError('שגיאה בטעינת הנתונים');
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [patientId]);

  if (loading) return <div className={styles.loading}>טוען...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  
  const { todaysExercises, nextAppointment } = dashboardData;

  const completionPercent = todaysExercises.length > 0
    ? Math.round((todaysExercises.filter(e => e.status === 'completed').length / todaysExercises.length) * 100)
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>שלום, {user?.first_name || '...'}</h1>
        <p>ברוך הבא למערכת המעקב האישית שלך</p>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><ChartBarIcon /></div>
          <div className={styles.statContent}>
            <h3>{completionPercent}%</h3>
            <p>השלמת תרגילים להיום</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><ClockIcon /></div>
          <div className={styles.statContent}>
            <h3>{todaysExercises.filter(e => e.status !== 'completed').length}</h3>
            <p>תרגילים נותרו להיום</p>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>התרגילים שלי להיום</h2>
            <Link to="/my-exercises" className={styles.link}>צפה בכל התרגילים</Link>
          </div>
          <div className={styles.exercisesList}>
            {todaysExercises.slice(0, 3).map(pe => (
              <div key={pe.id} className={styles.exerciseCard}>
                <div className={styles.exerciseInfo}>
                  <h3>{pe.exercise?.name}</h3>
                  <p>{pe.exercise?.description}</p>
                </div>
                <button className={styles.startButton}>התחל תרגיל</button>
              </div>
            ))}
             {todaysExercises.length === 0 && <p>אין תרגילים להיום. כל הכבוד!</p>}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>פגישה קרובה</h2>
            <Link to="/my-appointments" className={styles.link}>צפה בכל הפגישות</Link>
          </div>
          <div className={styles.appointmentsList}>
            {nextAppointment ? (
              <div className={styles.appointmentCard}>
                <div className={styles.appointmentInfo}>
                  <div className={styles.appointmentDate}>
                    <strong>{new Date(nextAppointment.scheduled_date).toLocaleDateString('he-IL')}</strong>
                    <span>{nextAppointment.scheduled_time}</span>
                  </div>
                  <div className={styles.appointmentDetails}>
                    <h3>{nextAppointment.type}</h3>
                    <p>עם {nextAppointment.therapist?.user?.first_name} {nextAppointment.therapist?.user?.last_name}</p>
                  </div>
                </div>
              </div>
            ) : (
                <p>אין פגישות קרובות.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
