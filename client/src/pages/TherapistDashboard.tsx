import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { UserGroupIcon, CalendarIcon, PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { getTherapistDashboardStats, getTherapistAppointmentsToday } from '../services/api';
import { Appointment } from '../types';
import styles from './TherapistDashboard.module.css';
import { useAuth } from '../contexts/AuthContext';

const TherapistDashboard: React.FC = () => {
  const { user } = useAuth();
  const therapistId = user?.role_id;

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['therapistDashboardStats', therapistId],
    queryFn: () => getTherapistDashboardStats(therapistId!),
    enabled: !!therapistId,
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ['therapistAppointmentsToday', therapistId],
    queryFn: () => getTherapistAppointmentsToday(therapistId!),
    enabled: !!therapistId,
  });

  const isLoading = statsLoading || appointmentsLoading;

  if (isLoading && therapistId) {
    return <div className={styles.loading}>טוען...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ברוך הבא למערכת השיקום</h1>
        <p className={styles.subtitle}>סקירה כללית של המטופלים והפעילויות שלך</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Link to="/patients" className={styles.statHeader} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
            <UserGroupIcon className={styles.icon} />
            <span>מטופלים פעילים</span>
          </Link>
          <div className={styles.statValue}>{stats?.patientCount || 0}</div>
        </div>

        <div className={styles.statCard}>
          <Link to="/appointments" className={styles.statHeader} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
            <CalendarIcon className={styles.icon} />
            <span>פגישות היום</span>
          </Link>
          <div className={styles.statValue}>{stats?.appointmentsTodayCount || 0}</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>פגישות היום</h2>
          <Link to="/appointments" className={styles.sectionLink}>
            כל הפגישות
          </Link>
        </div>
        <div className={styles.appointmentsList}>
          {(appointments || []).length > 0 ? (
            appointments!.map(appointment => (
              <Link
                key={appointment.id}
                to={`/appointment/${appointment.id}`}
                className={styles.appointmentCard}
              >
                <div className={styles.appointmentHeader}>
                  <h3>{appointment.patient?.user?.first_name} {appointment.patient?.user?.last_name}</h3>
                  <span className={`${styles.status} ${styles[appointment.status]}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className={styles.appointmentTime}>
                  <span>{appointment.scheduled_time}</span>
                </div>
              </Link>
            ))
          ) : (
            <p>אין פגישות היום.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
