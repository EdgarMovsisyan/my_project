const { UserSchema } = require('../db/User.js');
const User = require('../models/User.js');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redis = require('redis');


class UserService {
    constructor() {};

    #client = redis.createClient();

    async create(firstName, lastName, email, password, phone) {
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User(firstName, lastName, email, hashedPassword, phone);
        
        const user = await UserSchema.create(newUser);

        return user;
    }

    async login(email, password) {
        const user = await this.findUserByEmail(email);

        if(!user) {
            return {
                user: !user,
                error_message: 'user not found'
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return {
                user: !isMatch,
                error_message: 'invalid password'
            };
        }

        const token = jwt.sign(
            { userId: user.id },
            'secret',
            {expiresIn: '1h'}
        );

        await promisify(this.#client.set).bind(this.#client)(user.id, token);

        return {
            token: token,
            userId: user.id
        };
    }

    async logOut(token) {
        const { userId } = jwt.verify(token, 'secret');
        const user = await UserSchema.findOne({ _id: userId });

        if(!user) {
            return res.status(404).json('user not found');
        }

        await promisify(client.del).bind(client)(user.id);
    }

    checkLogin(token) {
        // // console.log(token)
        // const { userId, iat } = jwt.verify(token, 'secret');
        // // console.log(userId)
        // const user = UserSchema.findOne({ _id: userId });
        // const id = user._id;
        // const isLogined = promisify(this.#client.get).bind(this.#client)(user._id.toString());

        // if(!user || !isLogined) {
        //     throw new Error('This user notfound');
        // }

        // return id, isLogined;
    }

    async findUserByEmail(email) {
        const user = await UserSchema.findOne({ email: email });

        return user;
    }

    async findUserByPhone(phone) {
        const user = await UserSchema.findOne({ phone: phone });

        return user;
    }
}

module.exports = UserService;