import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, loading } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'patient',
    specialization: '',
    date_of_birth: '',
    condition: '',
    therapist_id: 'a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0' // Placeholder, needs to be dynamic
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await register(formData);
        navigate('/dashboard');
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginWrapper}>
        <div className={styles.logoContainer}>
          <p className={styles.subtitle}>מערכת סיוע לשיקום וטיפול</p>
        </div>
        <div className={styles.card}>
          <h2 className={styles.title}>הרשמה למערכת</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>סוג משתמש</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className={styles.select} required>
                <option value="patient">מטופל</option>
                <option value="therapist">מטפל</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} placeholder='דוא"ל' required />
            </div>
            <div className={styles.formGroup}>
              <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} className={styles.input} placeholder="סיסמה" required />
            </div>
            <div className={styles.formGroup}>
              <input id="first_name" type="text" name="first_name" value={formData.first_name} onChange={handleChange} className={styles.input} placeholder="שם פרטי" required />
            </div>
            <div className={styles.formGroup}>
              <input id="last_name" type="text" name="last_name" value={formData.last_name} onChange={handleChange} className={styles.input} placeholder="שם משפחה" required />
            </div>
            <div className={styles.formGroup}>
              <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} placeholder="מספר טלפון" />
            </div>

            {formData.role === 'therapist' && (
                <div className={styles.formGroup}>
                    <input id="specialization" type="text" name="specialization" value={formData.specialization} onChange={handleChange} className={styles.input} placeholder="התמחות" required />
                </div>
            )}
            
            {formData.role === 'patient' && (
                <>
                    <div className={styles.formGroup}>
                        <input id="date_of_birth" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className={styles.input} placeholder="תאריך לידה" required />
                    </div>
                    <div className={styles.formGroup}>
                        <input id="condition" type="text" name="condition" value={formData.condition} onChange={handleChange} className={styles.input} placeholder="מצב רפואי" required />
                    </div>
                </>
            )}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'נרשם...' : 'הרשמה'}
            </button>
            <div className={styles.footer}>
              <p className={styles.loginText}>
                כבר יש לך חשבון?{' '}
                <Link to="/login" className={styles.link}>התחבר כאן</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
