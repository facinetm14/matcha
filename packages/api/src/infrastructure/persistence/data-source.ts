import pg from 'pg';

const { Pool } = pg;

export const pgClient = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? '5432'),
  database: process.env.POSTGRES_DB,
});

export const dbConnect = async () => {
  return pgClient.connect();
};
