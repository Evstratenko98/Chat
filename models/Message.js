const { Schema, model } = require('mongoose')

const Message = new Schema({
    text: {type: String},
    createAt: {type: String},
    senderId: {type: Schema.Types.ObjectId, ref: 'User'},
})

module.exports = model('Message', Message)