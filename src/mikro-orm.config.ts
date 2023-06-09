import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

/* @dev This config file is used to create db and tables
 * Run this command
 * npx mikro-orm schema:create --run
 * */

export default defineConfig({
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  dbName: 'dawn_pool_keys_db',
  type: 'postgresql',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  cache: { enabled: false },
  debug: true,
  allowGlobalContext: false,
  extensions: [Migrator],
});
