import express from 'express';
import 'express-async-errors';
import * as tweetController from '../controller/tweet.js';
import validatorExpress from 'express-validator';
import { validate } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

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

// tweet에 관련된 것은 모두 로그인한 사람만 할 수 있도록 isAuth 추가
router.get('/', isAuth, tweetController.getTweets);

// GET /tweets/:id
router.get('/:id', isAuth, tweetController.getTweet);

// POST /tweets
router.post('/', isAuth, validateTweet, tweetController.createTweet);

// PUT /tweets/:id
router.put('/:id', isAuth, validateTweet, tweetController.updateTweet);

// DELETE /tweets/:id
router.delete('/:id', isAuth, tweetController.deleteTweet);

export default router;