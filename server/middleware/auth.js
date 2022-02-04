import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

const AUTH_ERROR = { message: 'Authentication Error' };

// isAuth 미들웨어
// 모든 요청에 대해서 헤더에 Authorization이 있는지 
// 있으면 검증할 수 있는 jwt를 가진 요청인지
// jwt에서 검증됐을 때 실제로 사용자가 우리 DB에 존재하는지 검증
export const isAuth = (req, res, next) => {
    // req의 헤더 안에 있는 Authorization이라는 키를 할당해준다.
    const authHeader = req.get('Authorization');

    // console.log(authHeader)
    // authHeader가 없거나 Bearer이 포함되어있지 않을 경우 에러 표시
    if (!(authHeader && authHeader.startsWith('Bearer '))) {
        return res.status(401).json(AUTH_ERROR);
    }

    // authHeader 있는 경우
    // Bearer 다음에 토큰이 있기 때문에 공백을 기준으로 배열로 만들어주고 1번째 요소인 토큰을 할당해준다.
    const token = authHeader.split(' ')[1];
    // console.log(token)

    // verify를 이용해서 토큰이 유효한지 검사해준다.
    // 키부분은 뒤에서 깔끔하게 만들어보자.
    jwt.verify(
        token,
        config.jwt.secretKey,
        async (error, decoded) => {
            if (error) {
                return res.status(401).json(AUTH_ERROR);
            }
            // userRepository는 비동기적이기 때문에 비동기적으로 처리해주기위해 async await 사용.
            const user = await userRepository.findById(decoded.id);

            // 사용자를 찾지 못한 경우
            if (!user) {
                return res.status(401).json(AUTH_ERROR);
            }
            // 사용자를 찾은 경우
            // req자체에 userId 추가해준다
            // -> req.customData request라는 object안에 앞으로 이어지는 다른 콜백함수에서 계속 동일하게 접근해야 하는 데이터라면 등록해줄 수 있다.
            req.userId = user.id;
            // console.log(req.userId)
            next();
        }
    )
}