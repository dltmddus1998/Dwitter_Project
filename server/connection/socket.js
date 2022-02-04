import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

class Socket {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: '*',
            },
        });

        this.io.use((socket, next) => {
            // 토큰 검증
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            jwt.verify(token, config.jwt.secretKey, (error, decoded)=> {
                if (error) {
                    return next(new Error('Authentication error'));
                }
                next();
            });
        });

        // 위의 검증 과정을 지나면 connection이 된다.
        this.io.on('connection', (socket) => {
            console.log('Socket client connected');
        });
    }
}

let socket;
// 위의 class Socket을 사용하기 위해 initSocket에 Socket에 해당하는 인스턴스를 만든다. 
export function initSocket(server) {
    // socket이 없다면 새로 만들기
    if (!socket) {
        socket = new Socket(server);
    }
}

// 사용자의 경우 getSocketIO를 호출하면 서버를 통해 만든 socket.io를 전달해준다.
// getSocketIO는 controller/tweet.js에서 사용한다.
export function getSocketIO() {
    if (!socket) {
        throw new Error('Please call init first');
    }
    return socket.io;
}