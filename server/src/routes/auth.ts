import express from 'express';
import { User, Patient, Therapist } from '../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, role, specialization, therapist_id, date_of_birth, condition } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password_hash,
      first_name,
      last_name,
      phone,
      role,
    });

    let roleData;
    // Create role-specific record
    if (role === 'patient') {
        if (!therapist_id || !date_of_birth || !condition) {
            return res.status(400).json({ error: 'Missing required fields for patient registration.' });
        }
      roleData = await Patient.create({
        user_id: user.id,
        therapist_id,
        date_of_birth,
        condition,
        status: 'active',
      });
    } else if (role === 'therapist') {
        if (!specialization) {
            return res.status(400).json({ error: 'Missing specialization for therapist registration.' });
        }
      roleData = await Therapist.create({
        user_id: user.id,
        specialization,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'supersecretkey123',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      role_data: roleData,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get role-specific ID
    let roleId;
    if (user.role === 'patient') {
      const patient = await Patient.findOne({ where: { user_id: user.id } });
      roleId = patient?.id;
    } else if (user.role === 'therapist') {
      const therapist = await Therapist.findOne({ where: { user_id: user.id } });
      roleId = therapist?.id;
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.id, role: user.role, role_id: roleId },
      process.env.JWT_SECRET || 'supersecretkey123',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        role_id: roleId,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
