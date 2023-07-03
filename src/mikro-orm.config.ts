import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

/* @dev This config file is used to create db and tables
 * Run this command
 * npx mikro-orm schema:create --run
 * */

export default defineConfig({
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  dbName: process.env.DB_NAME,
  type: 'postgresql',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  cache: { enabled: false },
  debug: true,
  allowGlobalContext: false,
  extensions: [Migrator],
});
