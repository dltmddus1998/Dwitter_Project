import { getUsers } from '../database/database.js';
import MongoDb from 'mongodb';

const ObjectId = MongoDb.ObjectId;
export async function findByUsername(username) {
    return getUsers()
        .findOne({username})
        .then(mapOptionalUser);
}

export async function findById(id) {
    return getUsers()
        .findOne({ _id: new ObjectId(id) })
        .next()
        .then(mapOptionalUser);
}

export async function createUser(user) {
    return getUsers()
        .insertOne(user)
        .then(data => data.insertedId.toString());
}

function mapOptionalUser(user) {
    // 새로운 유저가 있으면 {...user, id: user._id} 로 추가, 없으면 그대로 user 리턴
    user ? {...user, id: user._id.toString()} : user;
}
