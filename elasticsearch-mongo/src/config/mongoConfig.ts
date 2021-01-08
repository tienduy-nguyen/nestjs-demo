import { join } from 'path';

export function mongoConfig(): any {
  console.log('--------------------tst', process.env.DATABASE_TYPE);
  console.log('--------------------tst', process.env.DATABASE_HOST);
  console.log('--------------------tst', process.env.DATABASE_PORT);
  console.log('--------------------tst', process.env.DATABASE_USERNAME);
  return {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: false,
    autoLoadEntities: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  };
}
