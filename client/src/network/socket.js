import socket from 'socket.io-client';

export default class Socket {
    constructor(baseURL, getAccessToken) {
        // 소켓을 만들때 콜백함수를 이용해서 토큰을 전달한다.
        // ⭐️ 소켓에 있는 auth라는 field를 이용해서 전달한다. ⭐️
        this.io = socket(baseURL, {
            auth: (cb) => cb({ token: getAccessToken() }),
        });

        this.io.on('connect_error', (err) => {
            console.log('socket error', err.message);
        });
    }

    // event발생시 무얼할건지 callback 전달
    onSync(event, callback) {
        if (!this.io.connected) {
            this.io.connect();
        }

        this.io.on(event, message => callback(message));

        // event를 더이상 듣고싶지 않을 때 끈다.
        return () => this.io.off(event);
    }
}