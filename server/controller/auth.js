import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

// 회원가입
export async function signup(req, res) {
    // console.log(req.body);
    // req.body안에 있는 필요한 데이터를 다 받아오고 
    const { username, password, name, email, url } = req.body;
    console.log(req.body);
    // 사용자가 가입하기를 원하는 username이 repository에 있는지 확인
    const found = await userRepository.findByUsername(username);
    // 이미 가입한 경우 error
    if (found) {
        return res.status(409).json({ message: `${username} already exists` });
    }
    // 존재하지 않으면 password를 안전하게 hasing
    const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
    const userId = await userRepository.createUser({
        username,
        password: hashed,
        name,
        email,
        url,
    });

    const token = createJwtToken(userId);
    res.status(201).json({ token, username });
}

// 로그인
export async function login(req, res) {
    const { username, password } = req.body;
    const user = await userRepository.findByUsername(username);
    // 메시지에 아이디와 비밀번호 중 무엇이 틀렸는지 상세하게 알려주지 않는 이유는 보안상의 이유이다.
    if (!user) {
        return res.status(401).json({ message: 'Invalid user or password' });
    }
    // compare(data, hashed) 동일한지 비교
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid user or password' });
    }
    const token = createJwtToken(user.id);
    res.status(200).json({ token, username });
}

function createJwtToken(id) {
    // console.log(config.jwt.secretKey)
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}

// 유효한 사람인지 
// 미들웨어에서 검사를 해주므로 오진 않겠지만
// 로그인된 사용자라면 토큰에는 userid만 넣어서 만드므로 해당 사용자에 대한 정보를 읽어오기 위해 따로 사용자 정보를 읽어와서 토큰과 함께 user 데이터를 넘긴다.

export async function me (req, res, next) {
    // console.log(req.body);
    const user = await userRepository.findById(req.userId);
    // console.log('user', user);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ token: req.token, username: user.username });
}