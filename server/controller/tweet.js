import * as tweetRepository from '../data/tweet.js';

export async function getTweets(req, res) {
    const username = req.query.username;
    const data = await (username 
    ? tweetRepository.getAllTweetsByUsername(username) 
    : tweetRepository.getAll());
    res.status(200).json(data);
}

export async function getTweet(req, res) {
    const id = req.params.id;
    // 우리가 찾는 아이디와 일치하는 트윗을 찾음
    const tweet = await tweetRepository.getById(id);

    if (tweet) {
        res.status(200).json(tweet);
    } else {
        res.send(404).json({ message: `Tweet id(${id}) not found` });
    }
}

export async function createTweet(req, res) {
    const { text, username, name } = req.body;
    const tweet = await tweetRepository.create(text, username, name);
    res.status(201).json(tweet);
}

export async function updateTweet(req, res) {
    const id = req.params.id;
    const text = req.body.text;
    const tweet = await tweetRepository.update(id, text);
    if (tweet) {
        res.status(200).json(tweet);
    } else {
        res.status(404).json({ message: `Tweet id(${id}) not found` });
    }
}

export async function deleteTweet(req, res) {
    const id = req.params.id;
    await tweetRepository.remove(id)
    res.sendStatus(204);
}