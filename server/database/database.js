import MongoDB from 'mongodb';
import { config } from '../config.js';

// client에게 받은 db를 모듈 안에서만 쓸 수 있는 변수 
let db;

export async function connectDB() {
    return MongoDB.MongoClient.connect(config.db.host)
        .then(client => client.db())
}

// 사용자에 대한 collection을 줄 수 있는 함수
export function getUsers() {
    // 소문자로 작성해도 MongoDB에서 자동으로 대문자로 변경
    return db.collection('users');
}

// 트윗에 대한 collection을 줄 수 있는 함수
export function getTweets() {
    return db.collection('tweets');
}