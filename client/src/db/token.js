const TOKEN = 'token';

// 여기서 잠깐!!
// 브라우저 스토리지에 저장하는 것은 안전하지 않다. 

export default class TokenStorage {
    // 'token'이라는 이름으로 set, get ,clear 해준다
    saveToken(token) {
        // localStorage : browser에서 이용할 수 있는 API
        localStorage.setItem(TOKEN, token);
    }

    getToken() {
        return localStorage.getItem(TOKEN);
    }

    clearToken() {
        localStorage.clear();
    }
}