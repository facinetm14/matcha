import { buildSchema } from './db-schema';

export const initDb = async () => {
  await buildSchema();
};
