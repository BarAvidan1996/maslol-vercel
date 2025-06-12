import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Therapist from './Therapist';

class Patient extends Model {
  public id!: string;
  public user_id!: string;
  public therapist_id!: string;
  public date_of_birth!: Date;
  public condition!: string;
  public status!: 'active' | 'inactive';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Patient.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    therapist_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Therapist,
        key: 'id',
      },
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    condition: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Patient',
    tableName: 'Patients',
    timestamps: true,
    underscored: true,
  }
);

Patient.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Patient, { foreignKey: 'user_id', as: 'patient' });

Patient.belongsTo(Therapist, { foreignKey: 'therapist_id', as: 'therapist' });
Therapist.hasMany(Patient, { foreignKey: 'therapist_id', as: 'patients' });

export default Patient;
