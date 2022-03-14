import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';

const userSchema = new Mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    url: String,
});

useVirtualId(userSchema);

const User = Mongoose.model('User', userSchema);

export async function findByUsername(username) {
    // 가상의 아이디를 찾았기 때문에 mongoDB처럼 mapOptional함수를 만들 필요가 없다.
    return User.findOne({ username });
}

export async function findById(id) {
    return User.findById(id);
}

export async function createUser(user) {
    return new User(user)
        .save()
        .then(data => data.id);
}