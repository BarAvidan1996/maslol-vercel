import React from 'react';
import { useQuery } from '@tanstack/react-query';
import styles from './PatientProgress.module.css';
import { getPatientProgress } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = ['#00C49F', '#FF8042'];

const PatientProgress: React.FC = () => {
    const { user } = useAuth();
    const { id: paramId } = useParams();
    const patientId = paramId || user?.role_id;

    const { data: progress, isLoading, error } = useQuery({
        queryKey: ['patientProgress', patientId],
        queryFn: async () => (await getPatientProgress(patientId!)).data,
        enabled: !!patientId,
    });
    
    if (isLoading) return <div className={styles.loading}>טוען...</div>;
    if (error) return <div className={styles.error}>שגיאה בטעינת נתוני ההתקדמות.</div>;
    if (!progress) return <div className={styles.container}>לא נמצאו נתוני התקדמות.</div>;

    // Pie chart data for exercises
    const exercisePieData = [
        { name: 'הושלמו', value: progress.completed },
        { name: 'לא הושלמו', value: progress.totalAssigned - progress.completed },
    ];

    // Bar chart data for exercises
    const exerciseBarData = [
        { name: 'הושלמו', value: progress.completed },
        { name: 'הוקצו', value: progress.totalAssigned },
    ];

    // Placeholder for goals (if available in progress)
    const goalsPieData = progress.totalGoals !== undefined ? [
        { name: 'הושגו', value: progress.completedGoals },
        { name: 'לא הושגו', value: progress.totalGoals - progress.completedGoals },
    ] : null;
    const goalsBarData = progress.totalGoals !== undefined ? [
        { name: 'הושגו', value: progress.completedGoals },
        { name: 'הוגדרו', value: progress.totalGoals },
    ] : null;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>התקדמות אישית</h2>

            <div className={styles.progressGrid}>
                <div className={styles.progressCard}>
                    <h3>תרגילים שהוקצו</h3>
                    <p>{progress.totalAssigned}</p>
                </div>
                <div className={styles.progressCard}>
                    <h3>תרגילים שהושלמו</h3>
                    <p>{progress.completed}</p>
                </div>
                <div className={styles.progressCard}>
                    <h3>אחוז השלמה</h3>
                    <p>{progress.completionPercentage.toFixed(2)}%</p>
                </div>
                {progress.totalGoals !== undefined && (
                  <>
                    <div className={styles.progressCard}>
                        <h3>יעדים שהוגדרו</h3>
                        <p>{progress.totalGoals}</p>
                    </div>
                    <div className={styles.progressCard}>
                        <h3>יעדים שהושגו</h3>
                        <p>{progress.completedGoals}</p>
                    </div>
                  </>
                )}
            </div>

            <div className={styles.chartSection}>
                <div className={styles.chartTitle}>התקדמות תרגילים (גרף עוגה)</div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={exercisePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {exercisePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                <div className={styles.chartTitle}>התקדמות תרגילים (גרף עמודות)</div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={exerciseBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>

                {goalsPieData && (
                  <>
                    <div className={styles.chartTitle}>התקדמות יעדים (גרף עוגה)</div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={goalsPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {goalsPieData.map((entry, index) => (
                            <Cell key={`cell-goal-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
                )}
                {goalsBarData && (
                  <>
                    <div className={styles.chartTitle}>התקדמות יעדים (גרף עמודות)</div>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={goalsBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )}
            </div>
        </div>
    );
};

export default PatientProgress;
