import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Patient from './Patient';
import Exercise from './Exercise';
import Therapist from './Therapist';

class PatientExercise extends Model {
  public id!: string;
  public patient_id!: string;
  public exercise_id!: string;
  public assigned_date!: Date;
  public assigned_by_therapist_id!: string;
  public sets!: number;
  public repetitions!: number;
  public duration_seconds!: number;
  public frequency_per_week!: number;
  public status!: 'assigned' | 'active' | 'completed' | 'paused';
  public notes?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PatientExercise.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Patient, key: 'id' },
    },
    exercise_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Exercise, key: 'id' },
    },
    assigned_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    assigned_by_therapist_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Therapist, key: 'id' },
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    repetitions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration_seconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    frequency_per_week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('assigned', 'active', 'completed', 'paused'),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PatientExercise',
    tableName: 'PatientExercises',
    timestamps: true,
    underscored: true,
  }
);

PatientExercise.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Patient.hasMany(PatientExercise, { foreignKey: 'patient_id', as: 'patient_exercises' });

PatientExercise.belongsTo(Exercise, { foreignKey: 'exercise_id', as: 'exercise' });
Exercise.hasMany(PatientExercise, { foreignKey: 'exercise_id', as: 'patient_exercises' });

PatientExercise.belongsTo(Therapist, { foreignKey: 'assigned_by_therapist_id', as: 'therapist' });
Therapist.hasMany(PatientExercise, { foreignKey: 'assigned_by_therapist_id', as: 'assigned_exercises' });

export default PatientExercise;
