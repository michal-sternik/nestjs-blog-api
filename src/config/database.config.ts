import { registerAs } from '@nestjs/config';
import * as path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default registerAs(
  'database',
  (): PostgresConnectionOptions => ({
    url: process.env.CONNECTION_STRING,
    type: 'postgres',
    entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
);
