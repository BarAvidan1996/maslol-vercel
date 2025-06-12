import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeIcon, UserGroupIcon, ClipboardDocumentListIcon, ChartBarIcon, CalendarIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import TherapistDashboard from './pages/TherapistDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientList from './pages/PatientList';
import AppointmentList from './pages/AppointmentList';
import PatientProfile from './pages/PatientProfile';
import AppointmentDetails from './pages/AppointmentDetails';
import ExerciseLibrary from './pages/ExerciseLibrary';
import PatientExercises from './pages/PatientExercises';
import PatientAppointments from './pages/PatientAppointments';
import PatientProgress from './pages/PatientProgress';
import PatientRehabPlan from './pages/PatientRehabPlan';
import styles from './App.module.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return <>{children}</>;
};

const TherapistLayout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className={styles.app}>
            <nav className={styles.sidebar}>
                <h1>מסלו"ל</h1>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }: { isActive: boolean }) => `${styles.navigationLink} ${isActive ? styles.active : ''}`}>
                    <HomeIcon className={styles.navigationIcon} />דף הבית
                </NavLink>
                <NavLink 
                  to="/patients" 
                  className={({ isActive }: { isActive: boolean }) => `${styles.navigationLink} ${isActive ? styles.active : ''}`}>
                    <UserGroupIcon className={styles.navigationIcon} />מטופלים
                </NavLink>
                <NavLink 
                  to="/appointments" 
                  className={({ isActive }: { isActive: boolean }) => `${styles.navigationLink} ${isActive ? styles.active : ''}`}>
                    <CalendarIcon className={styles.navigationIcon} />פגישות
                </NavLink>
                <NavLink 
                  to="/exercise-library" 
                  className={({ isActive }: { isActive: boolean }) => `${styles.navigationLink} ${isActive ? styles.active : ''}`}>
                    <ClipboardDocumentListIcon className={styles.navigationIcon} />מאגר תרגילים
                </NavLink>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  <ArrowRightOnRectangleIcon className={styles.navigationIcon} />התנתקות
                </button>
            </nav>
            <main className={styles.mainContent}>{children}</main>
        </div>
    );
};

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className={styles.app}>
            <nav className={styles.sidebar}>
                <h1>מסלו"ל</h1>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }: { isActive: boolean }) => `${styles.navigationLink} ${isActive ? styles.active : ''}`}>
                    <HomeIcon className={styles.navigationIcon} />דף הבית
                </NavLink>
                <NavLink 
                  to="/my-exercises" 
                  className={({ isActive }: { isActive: boolean }) => `${styles.navigationLink} ${isActive ? styles.active : ''}`}>
                    <ClipboardDocumentListIcon className={styles.navigationIcon} />התרגילים שלי
                </NavLink>
                <NavLink 
                  to="/my-appointments" 
                  className={({ isActive }: { isActive: boolean }) => `${styles.navigationLink} ${isActive ? styles.active : ''}`}>
                    <CalendarIcon className={styles.navigationIcon} />הפגישות שלי
                </NavLink>
                <NavLink 
                  to="/my-progress" 
                  className={({ isActive }: { isActive: boolean }) => `${styles.navigationLink} ${isActive ? styles.active : ''}`}>
                    <ChartBarIcon className={styles.navigationIcon} />ההתקדמות שלי
                </NavLink>
                <NavLink 
                  to="/rehab-plan" 
                  className={({ isActive }: { isActive: boolean }) => `${styles.navigationLink} ${isActive ? styles.active : ''}`}>
                    <ClipboardDocumentListIcon className={styles.navigationIcon} />תוכנית השיקום
                </NavLink>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  <ArrowRightOnRectangleIcon className={styles.navigationIcon} />התנתקות
                </button>
            </nav>
            <main className={styles.mainContent}>{children}</main>
        </div>
    );
};

const DynamicLayout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    if (user?.role === 'therapist') {
        return <TherapistLayout>{children}</TherapistLayout>;
    }
    return <PatientLayout>{children}</PatientLayout>;
};

const Dashboard = () => {
    const { user } = useAuth();
    if (user?.role === 'therapist') {
        return <TherapistDashboard />;
    }
    return <PatientDashboard />;
};

// Create RTL cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create theme
const theme = createTheme({
  direction: 'rtl',
});

const App: React.FC = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                <Route path="/dashboard" element={<ProtectedRoute><DynamicLayout><Dashboard /></DynamicLayout></ProtectedRoute>} />
                <Route path="/patients" element={<ProtectedRoute><TherapistLayout><PatientList /></TherapistLayout></ProtectedRoute>} />
                <Route path="/patient/:id" element={<ProtectedRoute><TherapistLayout><PatientProfile /></TherapistLayout></ProtectedRoute>} />
                <Route path="/appointments" element={<ProtectedRoute><TherapistLayout><AppointmentList /></TherapistLayout></ProtectedRoute>} />
                <Route path="/appointment/:id" element={<ProtectedRoute><TherapistLayout><AppointmentDetails /></TherapistLayout></ProtectedRoute>} />
                <Route path="/exercise-library" element={<ProtectedRoute><TherapistLayout><ExerciseLibrary /></TherapistLayout></ProtectedRoute>} />

                <Route path="/my-exercises" element={<ProtectedRoute><PatientLayout><PatientExercises /></PatientLayout></ProtectedRoute>} />
                <Route path="/my-appointments" element={<ProtectedRoute><PatientLayout><PatientAppointments /></PatientLayout></ProtectedRoute>} />
                <Route path="/my-progress" element={<ProtectedRoute><PatientLayout><PatientProgress /></PatientLayout></ProtectedRoute>} />
                <Route path="/patient/:id/progress" element={<ProtectedRoute><TherapistLayout><PatientProgress /></TherapistLayout></ProtectedRoute>} />
                <Route path="/rehab-plan" element={<ProtectedRoute><PatientLayout><PatientRehabPlan /></PatientLayout></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </CacheProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
