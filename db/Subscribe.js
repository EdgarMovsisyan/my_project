const { Schema, SchemaTypes, model } = require('mongoose');


const schema = new Schema({
    source: SchemaTypes.ObjectId,
    target: SchemaTypes.ObjectId,
    state: String,
    date: {
        type: Date,
        default: new Date()
    }
});

const SubscribeSchema = model('subscriptions', schema);

module.exports = {
    SubscribeSchema
};