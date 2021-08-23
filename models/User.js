const { Schema, model } = require("mongoose");

const User = new Schema({
   username: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   gender: { type: String, required: true },
   age: { type: Number, required: true },
   rooms: { type: [{ type: Schema.Types.ObjectId, ref: "Room" }] },
});

module.exports = model("User", User);
