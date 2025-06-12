import express from 'express';
import { Exercise } from '../models';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all exercises
router.get('/library', authenticateToken, async (req, res) => {
  try {
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// Get exercise by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
});

// Create new exercise
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      instructions,
      category,
      difficulty_level,
      default_sets,
      default_repetitions,
      default_duration_seconds
    } = req.body;

    const exercise = await Exercise.create({
      name,
      description,
      instructions,
      category,
      difficulty_level,
      default_sets,
      default_repetitions,
      default_duration_seconds
    });

    res.status(201).json(exercise);
  } catch (error) {
    console.error('Error creating exercise:', error);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

// Update exercise
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    const {
      name,
      description,
      instructions,
      category,
      difficulty_level,
      default_sets,
      default_repetitions,
      default_duration_seconds
    } = req.body;

    await exercise.update({
      name,
      description,
      instructions,
      category,
      difficulty_level,
      default_sets,
      default_repetitions,
      default_duration_seconds
    });

    res.json(exercise);
  } catch (error) {
    console.error('Error updating exercise:', error);
    res.status(500).json({ error: 'Failed to update exercise' });
  }
});

// Delete exercise
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    await exercise.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting exercise:', error);
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
});

export default router;
