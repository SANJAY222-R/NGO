import { Sequelize } from 'sequelize';
import pg from 'pg';

const globalForSequelize = globalThis as unknown as {
  sequelize: Sequelize | undefined;
};

export const sequelize =
  globalForSequelize.sequelize ??
  new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    dialectModule: pg,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });


if (process.env.NODE_ENV !== 'production') globalForSequelize.sequelize = sequelize;
