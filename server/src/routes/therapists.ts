import express from 'express';
import { Therapist, User, Patient, Appointment } from '../models';
import { authenticateToken } from '../middleware/auth';
import { Op } from 'sequelize';

const router = express.Router();

// Get therapist by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const therapist = await Therapist.findByPk(req.params.id, {
      include: [
        { 
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'first_name', 'last_name', 'phone']
        },
      ]
    });
    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    res.json(therapist);
  } catch (error) {
    console.error('Error fetching therapist:', error);
    res.status(500).json({ error: 'Failed to fetch therapist' });
  }
});

// Get all patients for a therapist
router.get('/:id/patients', authenticateToken, async (req, res) => {
    try {
        const patients = await Patient.findAll({
            where: { therapist_id: req.params.id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['first_name', 'last_name', 'email']
            }]
        });
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients for therapist:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

// Get dashboard stats for a therapist
router.get('/:id/dashboard-stats', authenticateToken, async (req, res) => {
    try {
        const therapistId = req.params.id;

        const patientCount = await Patient.count({ where: { therapist_id: therapistId } });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const appointmentsTodayCount = await Appointment.count({
            where: {
                therapist_id: therapistId,
                scheduled_date: {
                    [Op.gte]: today,
                    [Op.lt]: nextWeek,
                },
            },
        });

        res.json({
            patientCount,
            appointmentsTodayCount,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

// Get all appointments for a therapist
router.get('/:id/appointments', authenticateToken, async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { therapist_id: req.params.id },
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }]
                }
            ]
        });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments for therapist:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Get today's appointments for a therapist
router.get('/:id/appointments/today', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointments = await Appointment.findAll({
            where: {
                therapist_id: req.params.id,
                scheduled_date: today,
            },
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }]
                }
            ],
            order: [['scheduled_date', 'ASC'], ['scheduled_time', 'ASC']]
        });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching today\'s appointments:', error);
        res.status(500).json({ error: 'Failed to fetch today\'s appointments' });
    }
});

export default router;
