const { Schema, model } = require('mongoose');

const schema = new Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 15,
        required: true
    },
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 15,
        required: true
    },
    email: {
        type: String,
        maxlength: 20,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        maxlength: 20,
        required: true,
        unique: true
    }
});

const UserSchema = model('users', schema);

module.exports = {
    UserSchema
};