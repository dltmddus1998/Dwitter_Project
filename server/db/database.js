import { config } from '../config.js';
import mysql from 'mysql2';


const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    database: config.db.database,
    password: config.db.password,
});

// 전반적으로 비동기를 사용하기 원함
export const db = pool.promise();