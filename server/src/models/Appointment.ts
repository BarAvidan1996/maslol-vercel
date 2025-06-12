import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Patient from './Patient';
import Therapist from './Therapist';

class Appointment extends Model {
  public id!: string;
  public patient_id!: string;
  public therapist_id!: string;
  public scheduled_date!: Date;
  public scheduled_time!: string;
  public duration_minutes!: number;
  public type!: 'consultation' | 'follow_up' | 'assessment';
  public status!: 'scheduled' | 'completed' | 'cancelled';
  public session_notes?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Patient,
        key: 'id',
      },
    },
    therapist_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Therapist,
        key: 'id',
      },
    },
    scheduled_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    scheduled_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
        allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('consultation', 'follow_up', 'assessment'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
      defaultValue: 'scheduled',
      allowNull: false,
    },
    session_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Appointment',
    tableName: 'Appointments',
    timestamps: true,
    underscored: true,
  }
);

// Define associations
Appointment.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Patient.hasMany(Appointment, { foreignKey: 'patient_id', as: 'appointments' });

Appointment.belongsTo(Therapist, { foreignKey: 'therapist_id', as: 'therapist' });
Therapist.hasMany(Appointment, { foreignKey: 'therapist_id', as: 'appointments' });

export default Appointment;
