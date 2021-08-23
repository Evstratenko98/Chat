const { Schema, model } = require("mongoose");

const Message = new Schema({
   text: { type: String },
   createAt: { type: String },
   sender: { type: String, ref: "User" },
});

const Room = new Schema({
   title: { type: String },
   messages: { type: [{ type: Message }] },
   users: { type: [{ type: Schema.Types.ObjectId, ref: "User" }] },
});

module.exports = model("Room", Room);
