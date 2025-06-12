import { Sequelize } from 'sequelize';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Aa123456!',
  database: 'rehabilitation_system',
  logging: true,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timestamps: true
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to MySQL database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the MySQL database:', error);
  });

export default sequelize;
