import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Therapist extends Model {
  public id!: string;
  public user_id!: string;
  public specialization!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Therapist.init(
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
    specialization: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Therapist',
    tableName: 'Therapists',
    timestamps: true,
    underscored: true,
  }
);

Therapist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Therapist, { foreignKey: 'user_id', as: 'therapist' });

export default Therapist;
