import { User, Therapist, Patient } from '../models';
import sequelize from '../config/database';

async function updatePatients() {
  try {
    // Find the therapist by email
    const therapistUser = await User.findOne({
      where: { email: 'gonbp9@gmail.com' }
    });

    if (!therapistUser) {
      console.error('Therapist not found');
      return;
    }

    const therapist = await Therapist.findOne({
      where: { user_id: therapistUser.id }
    });

    if (!therapist) {
      console.error('Therapist record not found');
      return;
    }

    // Update all patients to be linked to this therapist
    const [updatedCount] = await Patient.update(
      { therapist_id: therapist.id },
      { where: {} }
    );

    console.log(`Updated ${updatedCount} patients to be linked to therapist ${therapistUser.email}`);
  } catch (error) {
    console.error('Error updating patients:', error);
  } finally {
    await sequelize.close();
  }
}

updatePatients();
