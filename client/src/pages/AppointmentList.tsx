import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getTherapistAppointments, getTherapistPatients, createAppointment, deleteAppointment } from '../services/api';
import { Appointment, Patient } from '../types';
import styles from './AppointmentList.module.css';
import { useAuth } from '../contexts/AuthContext';
import ReactModal from 'react-modal';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

const AppointmentList: React.FC = () => {
  const { user } = useAuth();
  const therapistId = user?.role_id;
  const queryClient = useQueryClient();
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient_id: '',
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: 60,
    type: 'follow_up' as 'consultation' | 'follow_up' | 'assessment',
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ['therapistAppointments', therapistId],
    queryFn: () => getTherapistAppointments(therapistId!),
    enabled: !!therapistId,
  });

  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ['therapistPatients', therapistId],
    queryFn: () => getTherapistPatients(therapistId!),
    enabled: !!therapistId,
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapistAppointments', therapistId] });
    },
    onError: (error) => {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment.");
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הפגישה?')) {
      deleteAppointmentMutation.mutate(id);
    }
  };

  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapistAppointments', therapistId] });
      setModalIsOpen(false);
    },
    onError: (error) => {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment.");
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointment.patient_id || !newAppointment.scheduled_date || !newAppointment.scheduled_time) {
      alert('Please fill all fields.');
      return;
    }
    createAppointmentMutation.mutate({ ...newAppointment, therapist_id: therapistId! });
  };

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

  if (appointmentsLoading || patientsLoading) return <div className={styles.loading}>טוען...</div>;

  let filteredAppointments = appointments || [];
  if (search) {
    filteredAppointments = filteredAppointments.filter(a =>
      `${a.patient?.user?.first_name} ${a.patient?.user?.last_name}`.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (statusFilter !== 'all') {
    filteredAppointments = filteredAppointments.filter(a => a.status === statusFilter);
  }

  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time}`);
    const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className={styles.pageBg}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>הפגישות שלי</h1>
           <button className={styles.addButton} onClick={() => setModalIsOpen(true)}>
            <PlusIcon />
            קבע פגישה חדשה
          </button>
        </div>
        <div className={styles.actionsRow}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="חפש מטופל..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
            >
              <option value="all">הכל</option>
              <option value="scheduled">מתוכנן</option>
              <option value="completed">הושלם</option>
              <option value="cancelled">בוטל</option>
            </select>
          </div>
        <div className={styles.appointmentsList}>
          {sortedAppointments.map((appointment) => (
            <div key={appointment.id} className={styles.appointmentCard}>
              <Link
                to={`/appointment/${appointment.id}`}
                className={styles.appointmentInfo}
              >
                <div className={styles.patientDetails}>
                  <div className={styles.patientAvatar}>
                    {appointment.patient?.user?.first_name?.charAt(0)}{appointment.patient?.user?.last_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className={styles.appointmentTitle}>
                      {appointment.patient?.user?.first_name} {appointment.patient?.user?.last_name}
                    </h3>
                    <p className={styles.appointmentTime}>
                      {new Date(appointment.scheduled_date).toLocaleDateString('he-IL')} - {appointment.scheduled_time}
                    </p>
                  </div>
                </div>
              </Link>
              <div className={styles.cardActions}>
                <div className={`${styles.status} ${styles[appointment.status]}`}>{appointment.status === 'scheduled' ? 'מתוכנן' : appointment.status === 'completed' ? 'הושלם' : 'בוטל'}</div>
                {appointment.status === 'scheduled' && (
                  <>
                    <button
                      className={styles.cancelButton}
                      onClick={() => handleDelete(appointment.id)}
                      disabled={deleteAppointmentMutation.isPending}
                    >
                      {deleteAppointmentMutation.isPending ? 'מבטל...' : 'בטל פגישה'}
                    </button>
                    <button
                      className={styles.googleCalendarButton}
                      onClick={() => {
                        const [hours, minutes] = appointment.scheduled_time.split(':').map(Number);
                        const startDate = new Date(appointment.scheduled_date);
                        startDate.setHours(hours, minutes, 0, 0);
                        const endDate = new Date(startDate.getTime() + (appointment.duration_minutes || 60) * 60000);
                        const formatDateForGoogleCalendar = (date: Date) => {
                          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                        };
                        const startStr = formatDateForGoogleCalendar(startDate);
                        const endStr = formatDateForGoogleCalendar(endDate);
                        const url = new URL('https://calendar.google.com/calendar/render');
                        url.searchParams.set('action', 'TEMPLATE');
                        url.searchParams.set('text', `פגישה: ${appointment.type}`);
                        const patientName = appointment.patient?.user
                          ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
                          : '';
                        url.searchParams.set('details', `פגישה עם ${patientName}`);
                        url.searchParams.set('dates', `${startStr}/${endStr}`);
                        window.open(url.toString(), '_blank');
                      }}
                      type="button"
                    >
                      הוסף ליומן Google
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
       <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Create Appointment"
        className={styles.modal}
        overlayClassName={styles.overlay}
        ariaHideApp={false}
      >
        <h2>קביעת פגישה חדשה</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <select name="patient_id" value={newAppointment.patient_id} onChange={handleInputChange} required>
            <option value="" disabled>בחר מטופל</option>
            {patients?.map(p => (
              <option key={p.id} value={p.id}>{p.user?.first_name} {p.user?.last_name}</option>
            ))}
          </select>
          <input type="date" name="scheduled_date" value={newAppointment.scheduled_date} onChange={handleInputChange} required />
          <input type="time" name="scheduled_time" value={newAppointment.scheduled_time} onChange={handleInputChange} required />
          <input type="number" name="duration_minutes" value={newAppointment.duration_minutes} onChange={handleInputChange} />
          <select name="type" value={newAppointment.type} onChange={handleInputChange}>
            <option value="consultation">ייעוץ</option>
            <option value="follow_up">מעקב</option>
            <option value="assessment">הערכה</option>
          </select>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={createAppointmentMutation.isPending}>
              {createAppointmentMutation.isPending ? 'יוצר פגישה...' : 'צור פגישה'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={() => setModalIsOpen(false)}>ביטול</button>
          </div>
        </form>
      </ReactModal>
    </div>
  );
};

export default AppointmentList;
