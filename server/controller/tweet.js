import { getSocketIO } from '../connection/socket.js';
import * as tweetRepository from '../data/tweet.js';

export async function getTweets(req, res) {
    const username = req.query.username;
    const data = await (username 
    ? tweetRepository.getAllByUsername(username) 
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
    const { text } = req.body;
    const tweet = await tweetRepository.create(text, req.userId);
    res.status(201).json(tweet);
    // tweet을 새로 만들 때마다 socket에게 전달해준다.
    getSocketIO().emit('tweets', tweet);
}

export async function updateTweet(req, res) {
    const id = req.params.id;
    const text = req.body.text;
    const tweet = await tweetRepository.getById(id);
    if (!tweet) {
        // not login
        return res.sendStatus(404);
    }
    // console.log(tweet);
    if (tweet.userId !== req.userId) {
        // login -> no authentication
        return res.sendStatus(403);
    }

    const updated = await tweetRepository.update(id, text);
    res.status(200).json(updated);
}

export async function deleteTweet(req, res) {
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id);
    if (!tweet) {
        return res.sendStatus(404);
    } 
    if (tweet.userId !== req.userId) {
        return res.sendStatus(403);
    }

    await tweetRepository.remove(id)
    res.sendStatus(204);
}