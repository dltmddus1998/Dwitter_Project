import dotenv from 'dotenv';
dotenv.config();

// 값이 있는지 없는지 실시간으로 확인해서 서버를 시작하자마자 개발하는 단계에서 해당 부분을 알려주는 함수
function required(key, defaultValue = undefined) {
    // process.env에 우리가 지정한 key가 있다면 key의 값을 가져오고 없으면 defaultValue로 덮는다. defaultValue도 없다면 undefined
    // -> error
    const value = process.env[key] || defaultValue;
    if (value == null) { // null, undefined 모두 해당됨 
        throw new Error(`Key ${key} is undefined`);
    }
    // key나 defaultValue가 있다면 value 리턴
    return value;
}

export const config = {
    jwt: {
        secretKey: required('JWT_SECRET'),
        expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400))
    },
    bcrypt: {
        saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12))
    },
    host: {
        port: parseInt(required('HOST_PORT', 8080)),
    },
    db: {
        host: required('DB_HOST'),
    }
};