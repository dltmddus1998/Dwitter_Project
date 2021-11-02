import express from 'express';
import 'express-async-errors';
import * as tweetController from '../controller/tweet.js';
import validatorExpress from 'express-validator';
import { validate } from '../middleware/validator.js';

const { body } = validatorExpress;

const router = express.Router();

// 중복되는 부분 변수로 따로 선언해준다. 
const validateTweet = [
    body('text')
        .trim()
        .isLength({ min: 3 })
        .withMessage('text should be at least 3 characters'),
    validate
];

// GET /tweets
// GET /tweets?username=:username
// 값이 연결되는 게 아니라 함수를 연결하는 것 -> 함수 호출 x
router.get('/', tweetController.getTweets);

// GET /tweets/:id
router.get('/:id', tweetController.getTweet);

// POST /tweets
router.post('/', validateTweet, tweetController.createTweet);

// PUT /tweets/:id
router.put('/:id', validateTweet, tweetController.updateTweet);

// DELETE /tweets/:id
router.delete('/:id', tweetController.deleteTweet);

export default router;