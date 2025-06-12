import express from 'express';
import { Appointment, Patient, Therapist, User } from '../models';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all appointments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
          { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name']}] },
          { model: Therapist, as: 'therapist', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name']}] },
      ]
    });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get appointment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
        include: [
            { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name']}] },
            { model: Therapist, as: 'therapist', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name']}] },
        ]
    });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// Create new appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      patient_id,
      therapist_id,
      scheduled_date,
      scheduled_time,
      duration_minutes,
      type,
      status,
      session_notes,
    } = req.body;

    const appointment = await Appointment.create({
        patient_id,
        therapist_id,
        scheduled_date,
        scheduled_time,
        duration_minutes,
        type,
        status: status || 'scheduled',
        session_notes,
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const {
        scheduled_date,
        scheduled_time,
        duration_minutes,
        type,
        status,
        session_notes,
    } = req.body;

    await appointment.update({
        scheduled_date,
        scheduled_time,
        duration_minutes,
        type,
        status,
        session_notes,
    });

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Update appointment notes
router.put('/:id/notes', authenticateToken, async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        const { session_notes } = req.body;
        await appointment.update({ session_notes });
        
        res.json(appointment);
    } catch (error) {
        console.error('Error updating appointment notes:', error);
        res.status(500).json({ error: 'Failed to update appointment notes' });
    }
});

// Delete appointment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router;
