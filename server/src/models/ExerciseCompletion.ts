import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import PatientExercise from './PatientExercise';

class ExerciseCompletion extends Model {
  public id!: string;
  public patient_exercise_id!: string;
  public completed_date!: Date;
  public sets_completed!: number;
  public repetitions_completed!: number;
  public duration_completed_seconds!: number;
  public pain_level!: number;
  public difficulty_rating!: number;
  public notes?: string;
  public readonly created_at!: Date;
}

ExerciseCompletion.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    patient_exercise_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: PatientExercise, key: 'id' },
    },
    completed_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sets_completed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    repetitions_completed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration_completed_seconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pain_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    difficulty_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ExerciseCompletion',
    tableName: 'ExerciseCompletions',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  }
);

ExerciseCompletion.belongsTo(PatientExercise, { foreignKey: 'patient_exercise_id' });
PatientExercise.hasMany(ExerciseCompletion, { foreignKey: 'patient_exercise_id' });

export default ExerciseCompletion;
