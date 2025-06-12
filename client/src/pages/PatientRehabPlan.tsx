import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styles from './PatientRehabPlan.module.css';

// Mock data fallback
const mockPlan = {
  generalGoals: 'לשפר טווח תנועה, להפחית כאב, לחזור לפעילות יומיומית.',
  detailedGoals: [
    'להגיע לכיפוף ברך של 120 מעלות',
    'ללכת 500 מטר ללא כאב',
    'לשפר יציבות בעמידה',
  ],
  exercises: [
    { id: 1, name: 'Knee Bending', shortDesc: 'כיפוף ברך בשכיבה', },
    { id: 2, name: 'Straight Leg Raise', shortDesc: 'הרמת רגל ישרה', },
  ],
  equipment: ['גומיית פיזיותרפיה', 'כדור קטן', 'מדרגה נמוכה'],
};

const fetchRehabPlan = async () => {
  // כאן תוכל להחליף ל-API אמיתי
  return mockPlan;
};

const PatientRehabPlan: React.FC = () => {
  const { data: plan, isLoading } = useQuery({
    queryKey: ['patientRehabPlan'],
    queryFn: fetchRehabPlan,
  });
  const navigate = useNavigate();

  if (isLoading || !plan) return <div>טוען...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>תוכנית השיקום שלי</h1>
      <section className={styles.section}>
        <h2>מטרות כלליות</h2>
        <p>{plan.generalGoals}</p>
      </section>
      <section className={styles.section}>
        <h2>יעדים מפורטים</h2>
        <ul>
          {plan.detailedGoals.map((goal, idx) => (
            <li key={idx}>{goal}</li>
          ))}
        </ul>
      </section>
      <section className={styles.section}>
        <h2>רשימת תרגילים</h2>
        <ul className={styles.exerciseList}>
          {plan.exercises.map((ex) => (
            <li key={ex.id} className={styles.exerciseItem}>
              <div>
                <strong>{ex.name}</strong> - {ex.shortDesc}
              </div>
              <button className={styles.exerciseButton} onClick={() => navigate(`/my-exercises?id=${ex.id}`)}>
                בצע תרגיל
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.section}>
        <h2>ציוד נדרש</h2>
        <ul>
          {plan.equipment.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PatientRehabPlan;
