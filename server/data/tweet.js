import MongoDb from 'mongodb';
import { getTweets } from '../database/database.js';
import * as userRepository from './auth.js';

const ObjectId = MongoDb.ObjectId;

export async function getAll() {
    return getTweets()
    .find()
    .sort({ createdAt: -1 }) // createdAt에 있는 키가 제일 먼저 만들어진게 위에 나올수 있도록 정렬
    .toArray()
    .then(mapTweets);
}

export async function getAllByUsername(username) {
    return getTweets()
    .find({ username })
    .sort({ createdAt: -1 }) 
    .toArray()
    .then(mapTweets);
}

export async function getById(id) {
    return getTweets()
        .findOne({ _id: new ObjectId(id) })
        .then(mapOptionalTweet)
}

export async function create(text, userId) {
    const { name, username, url } = await userRepository.findById(userId);
    const tweet = {
        text,
        createdAt: new Date(),
        userId,
        name: name,
        username: username,
        url: url
    };
    return getTweets()
        .insertOne(tweet)
        .then(data => mapOptionalTweet({ ...tweet, id: data.insertedId }))
}

export async function update(id, text) {
    return getTweets()
        .findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { text } },
            { returnDocument: 'after' } // **returnDocument를 after로 해야 수정 후 객체를 리턴해준다.**
        )
        .then(result => result.value)
        .then(mapOptionalTweet);
}

export async function remove(id) {
    return getTweets()
        .deleteOne({ _id: new ObjectId(id) });
}

function mapOptionalTweet(tweet) {
    return tweet ? {...tweet, id: tweet._id.toString()} : tweet;
}

function mapTweets(tweets) {
    return tweets.map(mapOptionalTweet);
}