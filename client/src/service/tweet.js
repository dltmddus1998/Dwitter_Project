export default class TweetService {
  constructor(http, tokenStorage, socket) {
    // socket.js에서 만든 socket을 생성자에서 받는다.
    this.http = http;
    this.tokenStorage = tokenStorage;
    this.socket = socket;
  }

  async getTweets(username) {
    const query = username ? `?username=${username}` : '';
    return this.http.fetch(`/tweets${query}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
  }

  // fetch안에서 실패할 경우 에러를 던지니까 에러를 reject하는 프로미스가 된다. -- promise 참고 
  async postTweet(text) {
    return this.http.fetch(`/tweets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        text,
        username: 'ellie',
        name: 'Ellie',
      }),
    });
  }

  async deleteTweet(tweetId) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  async updateTweet(tweetId, text) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
    });
  }

  // tokenStorage에서 token을 받아온 후 Authorization 헤더를 만들어준다.
  getHeaders() {
    const token = this.tokenStorage.getToken();
    return {
      Authorization: `Bearer ${token}`
    }
  }

  // 사용자가 새로운 트윗을 만들 때 무엇을 하고 싶은지 callback으로 전달하면
  // socket에 onSync를 이용하여 해당하는 내용을 지속적으로 듣고 있는다. 
  onSync(callback) {
    return this.socket.onSync('tweets', callback);
  }
  
}
