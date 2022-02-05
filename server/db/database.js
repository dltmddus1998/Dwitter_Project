import { config } from '../config.js';
import SQ from 'sequelize';

const { host, user, database, password } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    // 기본값은 mysql이지만 명시적으로 나타내주자.
    dialect: 'mysql',
    logging: false // 데이터베이스 실행하는 것에 대해서 로그 남기는 옵션
});