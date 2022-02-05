import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js'

const DataTypes = SQ.DataTypes;

const Tweet = sequelize.define('tweet', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false, 
        primaryKey: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

// userId FK 설정
// Tweet은 User에 종속된다고 관계를 정의해주면 데이터베이스에서 알아서 foreign key로 연결해준다. 
Tweet.belongsTo(User);

const Sequelize = SQ.Sequelize;

const INCLUDE_USER = {
    attributes: [
        'id', 
        'text', 
        'createdAt', 
        'userId', 
        [Sequelize.col('user.name'), 'name'],
        [Sequelize.col('user.username'), 'username'],
        [Sequelize.col('user.url'), 'url']
    ],
    include: {
        model: User,
        attributes: []
    },
}

const ORDER_DESC = {
    order: [['createdAt', 'DESC']], // order by (createdAt을 기준으로 내림차순)
}


export async function getAll() {
    return Tweet.findAll({...INCLUDE_USER, ...ORDER_DESC});
}

export async function getAllByUsername(username) {
    return Tweet.findAll({...INCLUDE_USER, ...ORDER_DESC, 
        include: {...INCLUDE_USER.include, where: { username }
    }});
}

export async function getById(id) {
    return Tweet.findOne({
        where: {id},
        ...INCLUDE_USER
    })
}

// create의 경우에도 username과 name을 받아오는 게 아니라 userId를 받아온다. 
export async function create(text, userId) {
    return Tweet.create({ text, userId })
        .then(data => getById(data.dataValues.id));
}

export async function update(id, text) {
    return Tweet.findByPk(id, INCLUDE_USER)
        .then(tweet => {
            // text (update한 tweet내용)을 tweet.text에 바로 할당한다.
            tweet.text = text;
            // save를 통해 저장한 자기자신을 promise로 리턴한다. 
            return tweet.save();
        });
}

export async function remove(id) {
    return Tweet.findByPk(id)
        .then(tweet => {
            tweet.destroy();
        });
}