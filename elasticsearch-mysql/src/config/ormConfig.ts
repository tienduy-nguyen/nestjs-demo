import { join } from 'path';

export function ormConfig(): any {
  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true,
    autoLoadEntities: true,
    migrations: ['dist/data/migrations/*.js'],
    subscribers: ['dist/observers/subscribers/*.subscriber.js'],
    cli: {
      migrationsDir: 'src/data/migrations',
      subscribersDir: 'src/observers/subscribers',
    },
  };
}
