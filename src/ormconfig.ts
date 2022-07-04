import { ConnectionOptions } from 'typeorm';
import { loadEnviroment } from './env';
import { SnakeNamingStrategy } from './snake-naming.strategy';
import './polyfill';

loadEnviroment();

export const ormConfigOptions: ConnectionOptions = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    namingStrategy: new SnakeNamingStrategy(),
    // entities: ["dist/**/*.entity{.ts,.js}"],
    entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: true,
    charset: 'utf8mb4',
    logging: true
}
