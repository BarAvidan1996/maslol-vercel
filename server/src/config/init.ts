import sequelize from './database';
import { User, Patient, Therapist, Appointment, Exercise, PatientExercise, ExerciseCompletion } from '../models';
import bcrypt from 'bcryptjs';

const initDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');

    // Create main therapist for the demo
    let mainTherapistUser = await User.findOne({ where: { email: 'gonbp9@gmail.com' } });
    if (!mainTherapistUser) {
        const password_hash = await bcrypt.hash('123456', 10);
        mainTherapistUser = await User.create({
            email: 'gonbp9@gmail.com',
            password_hash,
            first_name: 'Gon',
            last_name: 'BP',
            role: 'therapist',
        });
    }
    
    let mainTherapist = await Therapist.findOne({ where: { user_id: mainTherapistUser.id } });
    if (!mainTherapist) {
        mainTherapist = await Therapist.create({
            user_id: mainTherapistUser.id,
            specialization: 'General',
        });
    }

    // Check if the main therapist has enough patients, if not, create them.
    const patientCount = await Patient.count({ where: { therapist_id: mainTherapist.id } });
    if (patientCount < 20) {
        const patientsToCreate = 20 - patientCount;
        const patientNames = ['John', 'Abigail', 'Peter', 'Jessica', 'Michael', 'Emily', 'David', 'Sarah', 'Chris', 'Laura', 'James', 'Linda', 'Robert', 'Patricia', 'William', 'Jennifer', 'Richard', 'Mary', 'Joseph', 'Susan'];
        const password_hash = await bcrypt.hash('123456', 10);

        for (let i = 0; i < patientsToCreate; i++) {
            const email = `patient${patientCount + i + 1}@example.com`;
            
            // Check if user already exists
            let user = await User.findOne({ where: { email } });
            if (!user) {
                user = await User.create({
                    email,
                    password_hash,
                    first_name: patientNames[i % patientNames.length],
                    last_name: `Doe${i}`,
                    role: 'patient',
                });

                await Patient.create({
                    user_id: user.id,
                    therapist_id: mainTherapist.id,
                    date_of_birth: '1990-01-01',
                    condition: 'General Pain',
                    status: 'active',
                });
            }
        }
        console.log(`Created ${patientsToCreate} mock patients.`);
    }

    // Create some exercises if they don't exist
    const exerciseCount = await Exercise.count();
    if (exerciseCount === 0) {
      await Exercise.bulkCreate([
        {
          name: 'Knee Bending',
          description: 'Bend the knee while lying on your stomach.',
          instructions: 'Perform 3 sets of 12 repetitions.',
          category: 'lower-body',
          difficulty_level: 'beginner',
          default_sets: 3,
          default_repetitions: 12,
          default_duration_seconds: 60,
        },
        {
          name: 'Straight Leg Raise',
          description: 'Raise the leg straight while lying on your back.',
          instructions: 'Perform 3 sets of 15 repetitions.',
          category: 'lower-body',
          difficulty_level: 'intermediate',
          default_sets: 3,
          default_repetitions: 15,
          default_duration_seconds: 75,
        },
      ]);
      console.log('Demo exercises created');
    }
    
    // Assign exercises and appointments to all patients who don't have them
    const allPatients = await Patient.findAll();
    const allExercises = await Exercise.findAll();

    if (allPatients.length > 0 && allExercises.length > 0) {
        for (const patient of allPatients) {
            const assignedExerciseCount = await PatientExercise.count({ where: { patient_id: patient.id } });
            if (assignedExerciseCount === 0) {
                const randomExercise = allExercises[Math.floor(Math.random() * allExercises.length)];
                await PatientExercise.create({
                    patient_id: patient.id,
                    exercise_id: randomExercise.id,
                    assigned_by_therapist_id: patient.therapist_id,
                    assigned_date: new Date(),
                    sets: 3,
                    repetitions: 12,
                    duration_seconds: 60,
                    frequency_per_week: 3,
                    status: 'assigned',
                });
            }

            const appointmentCount = await Appointment.count({ where: { patient_id: patient.id } });
            if (appointmentCount === 0) {
                await Appointment.create({
                    patient_id: patient.id,
                    therapist_id: patient.therapist_id,
                    scheduled_date: new Date(Date.now() + (Math.floor(Math.random() * 7) + 1) * 86400000), 
                    scheduled_time: '11:00:00',
                    duration_minutes: 45,
                    type: 'follow_up',
                    status: 'scheduled',
                });
            }
        }
        console.log('Finished assigning exercises and appointments.');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default initDatabase;
