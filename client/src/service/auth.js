export default class AuthService {
  // 우리가 만든 http module과 tokenStorage를 가지고 와서 
  // 우리가 받은 토큰을 저장하고 읽을 수 있는 클래스이다.
  // tokenStorage는 db/token.js에 있다.
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  async signup(username, password, name, email, url) {
    const data = await this.http.fetch('/auth/signup', {
      method: 'POST',
      body : JSON.stringify({
        username,
        password,
        name,
        email,
        url,
      }),
    });
    // 위에서 받아온 데이터를 tokenStorage에 저장해둔다 
    this.tokenStorage.saveToken(data.token);
    return data;
  }

  async login(username, password) {
    const data = await this.http.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });
    this.tokenStorage.saveToken(data.token);
    return data;
  }

  async me() {
    // 토큰을 읽어와서 헤더에 추가한다.
    const token = this.tokenStorage.getToken();
    return this.http.fetch('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async logout() {
    // 클라이언트 자체적으로 토큰을 지운다.
    this.tokenStorage.clearToken();
  }
}
