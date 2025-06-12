import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Exercise extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public instructions!: string;
  public category!: string;
  public difficulty_level!: 'beginner' | 'intermediate' | 'advanced';
  public default_sets!: number;
  public default_repetitions!: number;
  public default_duration_seconds!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Exercise.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    difficulty_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
    },
    default_sets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    default_repetitions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    default_duration_seconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Exercise',
    tableName: 'Exercises',
    timestamps: true,
    underscored: true,
  }
);

export default Exercise;
