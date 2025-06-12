import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointment, updateAppointment, updateAppointmentNotes } from '../services/api';
import { Appointment } from '../types';
import styles from './AppointmentDetails.module.css';
import { CalendarIcon, ClockIcon, UserCircleIcon, PencilSquareIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import AddToGoogleCalendar from './AddToGoogleCalendar';

const AppointmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [sessionNotes, setSessionNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const { data: appointment, isLoading, error } = useQuery<Appointment>({
    queryKey: ['appointment', id],
    queryFn: () => getAppointment(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (appointment?.session_notes) {
      setSessionNotes(appointment.session_notes);
    }
  }, [appointment]);

  const updateStatusMutation = useMutation({
    mutationFn: (status: 'completed' | 'cancelled') => updateAppointment(id!, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
      queryClient.invalidateQueries({ queryKey: ['therapistAppointments'] });
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: (notes: string) => updateAppointmentNotes(id!, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
      setIsEditingNotes(false);
    },
  });

  const handleSaveNotes = () => {
    updateNotesMutation.mutate(sessionNotes);
  };

  if (isLoading) return <div className={styles.loading}>טוען...</div>;
  if (error) return <div className={styles.error}>שגיאה בטעינת נתוני הפגישה.</div>;
  if (!appointment) return <div className={styles.error}>הפגישה לא נמצאה.</div>;

  const { patient, scheduled_date, scheduled_time, duration_minutes, type, status } = appointment;

  const getStatusInfo = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return { text: 'מתוכנן', style: styles.scheduled };
      case 'completed':
        return { text: 'הושלם', style: styles.completed };
      case 'cancelled':
        return { text: 'בוטל', style: styles.cancelled };
      default:
        return { text: status, style: '' };
    }
  };

  const getTypeText = (type: Appointment['type']) => {
    switch (type) {
      case 'consultation':
        return 'ייעוץ';
      case 'follow_up':
        return 'מעקב';
      case 'assessment':
        return 'הערכה';
      default:
        return type;
    }
  };

  const statusInfo = getStatusInfo(status);

  // Helper to create Date object with date and time combined
  const getStartDateTime = () => {
    return new Date(`${scheduled_date}T${scheduled_time}:00`);
  };

  const getEndDateTime = () => {
    const start = getStartDateTime();
    return new Date(start.getTime() + duration_minutes * 60000);
  };

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <ArrowUturnLeftIcon />
        חזור לרשימה
      </button>

      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <UserCircleIcon className={styles.patientIcon} />
          <div>
            <h1 className={styles.patientName}>
              {patient?.user?.first_name} {patient?.user?.last_name}
            </h1>
            <p className={styles.appointmentType}>{getTypeText(type)}</p>
          </div>
        </div>
        <div className={`${styles.statusBadge} ${statusInfo.style}`}>{statusInfo.text}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <CalendarIcon />
            <span>
              {new Date(scheduled_date).toLocaleDateString('he-IL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className={styles.detailItem}>
            <ClockIcon />
            <span>
              {scheduled_time} ({duration_minutes} דקות)
            </span>
          </div>
        </div>
      </div>

      {status === 'scheduled' && (
        <div className={`${styles.card} ${styles.actionsCard}`}>
          <h3>עדכן סטטוס פגישה:</h3>
          <div className={styles.actionButtons}>
            <button
              onClick={() => updateStatusMutation.mutate('completed')}
              className={`${styles.actionButton} ${styles.completeButton}`}
              disabled={updateStatusMutation.isPending}
            >
              <CheckCircleIcon /> סמן כהושלם
            </button>
            <button
              onClick={() => updateStatusMutation.mutate('cancelled')}
              className={`${styles.actionButton} ${styles.cancelButton}`}
              disabled={updateStatusMutation.isPending}
            >
              <XCircleIcon /> בטל פגישה
            </button>
          </div>
        </div>
      )}

      <div className={`${styles.card} ${styles.notesCard}`}>
        <div className={styles.notesHeader}>
          <h3>
            <PencilSquareIcon /> הערות סשן
          </h3>
          {!isEditingNotes && (
            <button onClick={() => setIsEditingNotes(true)} className={styles.editButton}>
              ערוך
            </button>
          )}
        </div>
        {isEditingNotes ? (
          <div className={styles.notesEditor}>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className={styles.notesTextarea}
              rows={8}
            />
            <div className={styles.editorActions}>
              <button onClick={handleSaveNotes} className={styles.saveButton} disabled={updateNotesMutation.isPending}>
                {updateNotesMutation.isPending ? 'שומר...' : 'שמור'}
              </button>
              <button onClick={() => setIsEditingNotes(false)} className={styles.cancelEditButton}>
                בטל
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.notesContent}>{appointment.session_notes || 'אין עדיין הערות לפגישה זו.'}</p>
        )}
      </div>

      {/* Google Calendar button wrapped with margin for spacing */}
      <div style={{ marginTop: '20px' }}>
        <AddToGoogleCalendar
          title={`פגישה עם ${patient?.user?.first_name} ${patient?.user?.last_name}`}
          description={`פגישה מסוג ${getTypeText(type)}`}
          location="כתובת הקליניקה או מיקום הפגישה"
          startTime={getStartDateTime()}
          endTime={getEndDateTime()}
        />
      </div>
    </div>
  );
};

export default AppointmentDetails;
