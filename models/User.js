const { Schema, model } = require('mongoose')

const User = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: Schema.Types.ObjectId, required: true, ref: "Role"},
    rooms: {type: [{type: Schema.Types.ObjectId, ref: "Room"}]}
})

module.exports = model("User", User)