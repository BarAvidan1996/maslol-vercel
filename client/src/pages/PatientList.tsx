import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getTherapistPatients, unassignPatient, getExerciseLibrary } from '../services/api';
import { Patient } from '../types';
import styles from './PatientList.module.css';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon, TrashIcon, PlusIcon, ClipboardDocumentListIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const PatientList: React.FC = () => {
  const { user } = useAuth();
  const therapistId = user?.role_id;
  const queryClient = useQueryClient();
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showRehabPlanModal, setShowRehabPlanModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ['therapistPatients', therapistId],
    queryFn: () => getTherapistPatients(therapistId!),
    enabled: !!therapistId,
  });

  const unassignMutation = useMutation({
    mutationFn: unassignPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapistPatients', therapistId] });
    }
  });

  const handleRemovePatient = (patientId: string, event: React.MouseEvent) => {
    event.preventDefault();
    if(window.confirm('האם אתה בטוח שברצונך להסיר את המטופל מרשימתך?')) {
      unassignMutation.mutate(patientId);
    }
  };

  const handleCreateRehabPlan = (patient: Patient, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedPatient(patient);
    setShowRehabPlanModal(true);
  };

  const [search, setSearch] = useState('');

  const { data: exercises, isLoading: exercisesLoading } = useQuery({
    queryKey: ['exerciseLibrary'],
    queryFn: getExerciseLibrary
  });

  if (isLoading) return <div className={styles.loading}>טוען...</div>;

  const filteredPatients = patients?.filter(p => 
    `${p.user?.first_name} ${p.user?.last_name}`.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>המטופלים שלי</h1>
        <div className={styles.headerActions}>
          <button 
            className={styles.createButton}
            onClick={() => setShowNewPatientModal(true)}
          >
            <PlusIcon className={styles.buttonIcon} />
            <span>צור מטופל חדש</span>
          </button>
          <div className={styles.searchContainer}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="חפש מטופל לפי שם..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.patientGrid}>
        {filteredPatients.map((patient) => (
          <div key={patient.id} className={styles.patientCard}>
            <Link to={`/patient/${patient.id}`} className={styles.patientLink}>
              <div className={styles.cardHeader}>
                <UserCircleIcon className={styles.avatar}/>
                <div className={styles.patientInfo}>
                  <h3 className={styles.patientName}>{patient.user?.first_name} {patient.user?.last_name}</h3>
                  <p className={styles.patientCondition}>{patient.condition}</p>
                </div>
              </div>
            </Link>
            <div className={styles.cardActions}>
              <button 
                onClick={(e) => handleCreateRehabPlan(patient, e)}
                className={styles.actionButton}
                title="צור תוכנית שיקום"
              >
                <ClipboardDocumentListIcon className={styles.actionIcon} />
              </button>
              <Link 
                to={`/patient/${patient.id}/progress`}
                className={styles.actionButton}
                title="דוח התקדמות"
              >
                <ChartBarIcon className={styles.actionIcon} />
              </Link>
              <button 
                onClick={(e) => handleRemovePatient(patient.id, e)} 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                disabled={unassignMutation.isPending}
                title="הסר מטופל"
              >
                <TrashIcon className={styles.actionIcon} />
              </button>
            </div>
            <div className={styles.cardFooter}>
              <span className={`${styles.status} ${styles[patient.status]}`}>
                {patient.status === 'active' ? 'פעיל' : 'לא פעיל'}
              </span>
            </div>
          </div>
        ))}
        {filteredPatients.length === 0 && (
          <div className={styles.noPatients}>
            <p>לא נמצאו מטופלים.</p>
          </div>
        )}
      </div>

      {showNewPatientModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>צור מטופל חדש</h2>
            <form className={styles.newPatientForm}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">שם פרטי</label>
                <input type="text" id="firstName" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName">שם משפחה</label>
                <input type="text" id="lastName" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">אימייל</label>
                <input type="email" id="email" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">טלפון</label>
                <input type="tel" id="phone" required />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>צור מטופל</button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowNewPatientModal(false)}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRehabPlanModal && selectedPatient && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>צור תוכנית שיקום</h2>
            <form className={styles.rehabPlanForm}>
              <div className={styles.formGroup}>
                <label htmlFor="goals">מטרות</label>
                <textarea id="goals" rows={3} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="objectives">יעדים</label>
                <textarea id="objectives" rows={3} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="exercises">תרגילים</label>
                <select id="exercises" multiple required>
                  {exercisesLoading && <option>טוען...</option>}
                  {exercises && exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="equipment">ציוד נדרש</label>
                <textarea id="equipment" rows={2} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="notes">הערות</label>
                <textarea id="notes" rows={3} />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>שמור תוכנית</button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowRehabPlanModal(false)}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
