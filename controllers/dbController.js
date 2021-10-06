const Role = require("../models/Role.js");
const User = require("../models/User.js");
const Room = require("../models/Room.js");
const mongoose = require("mongoose");

class dbController {
    //Роли
    async addRole(req, res) {
        try {
            const { value } = req.body;
            const role = new Role({ value });
            await role.save();

            res.json({ message: "Добавлена новая роль" });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка!" });
        }
    }
    async deleteRole(req, res) {
        try {
            const { value } = req.body;
            await Role.deleteOne({ value });

            res.json("Выбранная роль удалена");
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка!" });
        }
    }
    async getRoles(req, res) {
        try {
            const roles = await Role.find();
            res.json(roles);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка!" });
        }
    }

    //Пользователи
    async addUser(req, res) {
        try {
            let { username, password, gender, age } = req.body;
            const user = new User({ username, password, gender, age });
            await user.save();

            res.json("Пользователь создан!");
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка!" });
        }
    }
    async deleteUser(req, res) {
        try {
            const { username } = req.body;
            await Role.deleteOne({ username });

            res.json("Выбранный пользователь удален");
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка!" });
        }
    }
    async getUser(req, res) {
        try {
            const { userId } = req.body;
            const user = await User.findOne({ _id: userId });
            res.json(user);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка!" });
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: "roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "role",
                    },
                },
            ]);
            res.json(users);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка!" });
        }
    }
    async updateUser(req, res) {
        try {
            const { _id, username, password } = req.body;
            const user = User.findOne({ _id });

            if (username) await user.updateOne({ username });
            if (password) await user.updateOne({ password });

            res.json({ message: "Действие выполнено" });
        } catch (e) {
            console.log(e);
            res.status(400).json("Произошла ошибка");
        }
    }

    //Комнаты

    async addRoom(req, res) {
        try {
            const { title } = req.body;
            const room = new Room({ title });
            await room.save();
            res.json(`Комната ${title} создана`);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка" });
        }
    }
    async deleteRoom(req, res) {
        try {
            const { _id } = req.body;
            await Room.deleteOne({ _id });

            res.json("Выбранная комната удалена");
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка" });
        }
    }
    async getRooms(req, res) {
        try {
            let rooms = await Room.find().select({ messages: false });

            res.json({ rooms });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка" });
        }
    }
    async inviteRoom(req, res) {
        try {
            const { userId, roomId } = req.body;
            await Room.updateOne({ _id: roomId }, { $push: { users: userId } });

            const user = await User.findOne({ _id: userId });
            const room = await Room.findOne({ _id: roomId });

            res.json({ message: "Операция выполнена" });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Произошла ошибка" });
        }
    }

    //Сообщения
    async addMessage(req, res) {
        try {
            const { roomId, text, sender, createAt } = req.body;
            const _id = mongoose.Types.ObjectId();
            const message = { text, createAt, sender, _id };

            await Room.updateOne({ _id: roomId }, { $push: { messages: message } });

            res.json(message);
        } catch (e) {
            console.log(e);
            res.status(400).json("Произошла ошибка");
        }
    }

    async deleteMessage(req, res) {
        try {
            const { roomId, messageId } = req.body;

            await Room.updateOne({ _id: roomId }, { $pull: { messages: { _id: messageId } } });
            res.json({ message: "Действие выполнено!" });
        } catch (e) {
            console.log(e);
            res.status(400).json("Произошла ошибка");
        }
    }
    async roomGetMessages(req, res) {
        try {
            const { roomId } = req.body;
            const { messages } = await Room.findOne({ _id: roomId });

            res.json({ messages });
        } catch (e) {
            console.log(e);
            res.status(400).json("Произошла ошибка");
        }
    }
}

module.exports = new dbController();
