// 데이터베이스 형성 전에 임의로 데이터 삽입
let tweets = [
    {
        id: '1',
        text: 'hi my name is seungyeon',
        createdAt: Date.now().toString(),
        name: 'Seung',
        username: 'yeoni',
        url: 'https://cdn.expcloud.co/life/uploads/2020/04/27135731/Fee-gentry-hed-shot-1.jpg',
    },
    {
        id: '2',
        text: '안녕!!',
        createdAt: Date.now().toString(),
        name: 'Bob',
        username: 'bob',
        url: 'https://cdn.expcloud.co/life/uploads/2020/04/27135731/Fee-gentry-hed-shot-1.jpg',
    },
];

export async function getAll() {
    return tweets;
}

export async function getAllTweetsByUsername(username) {
    return tweets.filter(tweet => tweet.username === username);
}

export async function getById(id) {
    return tweets.find(tweet => tweet.id === id);
}

export async function create(text, username, name) {
    const tweet = {
        id: Date.now().toString(),
        text,
        createdAt: new Date(),
        name,
        username,
    };
    tweets = [tweet, ...tweets];
    return tweet;
}

export async function update(id, text) {
    const tweet = tweets.find(tweet => tweet.id === id);
    if (tweet) {
        tweet.text = text;
    } 
    return tweet;
}

export async function remove(id) {
    return tweets.filter(tweet => tweet.id !== id); 
}