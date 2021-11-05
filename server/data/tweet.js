import * as userRepository from './auth.js'

// 데이터베이스 형성 전에 임의로 데이터 삽입

// 사용자가 url이나 email 정보를 변경했을 때 모든 곳에서 수정해줘야 하기 때문에 userId를 통해 사용자의 정보를 가리킨다.
let tweets = [
    {
        id: '1',
        text: 'hi my name is seungyeon',
        createdAt: new Date().toString(),
        userId: '1',
    },
    {
        id: '2',
        text: '안녕!!',
        createdAt: new Date().toString(),
        userId: '1',
    },
];

// 
export async function getAll() {
    // map에서 리턴되는 것은 tweet을 리턴하는 프로미스이므로 Promise.all 이용
    return Promise.all(
        tweets.map(async tweet => {
            // tweet의 userId를 이용해서 사용자 정보를 받아온 후
            const { username, name, url } = await userRepository.findById(
                tweet.userId
            );
            // tweet의 정보와 사용자 정보를 더하면 된다.
            return { ...tweet, username, name, url };
        })
    )
}

export async function getAllByUsername(username) {
    return getAll().then(tweets => { // {id, text, createdAt, userId, username, name, url}
        tweets.filter(tweet => tweet.username === username);
    });
}

export async function getById(id) {
    const found = tweets.find(tweet => tweet.id === id);
    if (!found) {
        return null;
    }
    const { username, name, url } = await userRepository.findById(found.userId);
    return { ...found, username, name, url };
}

// create의 경우에도 username과 name을 받아오는 게 아니라 userId를 받아온다. 
export async function create(text, userId) {
    const tweet = {
        id: new Date().toString(),
        text,
        createdAt: new Date(),
        userId,
    };
    
    tweets = [tweet, ...tweets];
    // return tweet;
    // 이후 getById를 이용하여 사용자의 정보들을 가져온다.
    return getById(tweet.id);
}

export async function update(id, text) {
    const tweet = tweets.find(tweet => tweet.id === id);
    if (tweet) {
        tweet.text = text;
    } 
    // return tweet;
    return getById(tweet.id);
}

export async function remove(id) {
    return tweets.filter(tweet => tweet.id !== id); 
}