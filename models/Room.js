const { Schema, model } = require('mongoose')

const Room = new Schema({
    title: {type: String},
    messages: {type: [{type: Schema.Types.ObjectId, ref: "Message"}]},
    users: {type: [{type: Schema.Types.ObjectId, ref: "User"}]}
})

module.exports = model("Room", Room)