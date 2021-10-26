import express from 'express';
import {} from 'express-async-errors';
import tweetsRouter from './router/tweets.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/tweets', tweetsRouter);

app.listen(8080);

