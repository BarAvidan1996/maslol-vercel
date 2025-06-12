import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Rehabilitation System</Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/exercises">Exercises</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div className={styles.notifications}>
        <BellIcon className={styles.icon} />
      </div>
    </nav>
  );
};

export default Navbar;
