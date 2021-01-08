import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: true,
};
