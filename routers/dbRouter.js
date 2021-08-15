const Router = require('express')
const Role = require('../models/Role.js')
const User = require('../models/User.js')
const Room = require('../models/Room.js')
const Message = require('../models/Message.js')

const router = new Router()

router.post('/addRole', async (req, res) => {
    try {
        const {value} = req.body
        const role = new Role({value})
        await role.save()

        res.json({message: "Добавлена новая роль"})
    }
    catch(e) {
        console.log(e)
        res.status(200).json({message: "Произошла ошибка!"})
    }
})
router.post('/deleteRole', async (req, res) => {
    try {
        const {value} = req.body
        await Role.deleteOne({value})
        
        res.json('Выбранная роль удалена')
    } catch(e) {
        console.log(e)
        res.status(200).json({message: "Произошла ошибка!"})
    }
})
router.get('/getRoles', async(req, res) => {
    try {
        const roles = await Role.find()
        res.json(roles)

    } catch(e) {
        console.log(e)
        res.status(200).json({message: "Произошла ошибка!"})
    }
})

router.post('/addUser', async (req, res) => {
    try {
        let {username, password, role} = req.body
        role = await Role.findOne({value: role})
        const user = new User({username, password, role: role._id})
        await user.save()

        res.json('Пользователь создан!')
    }
    catch(e) {
        console.log(e)
        res.status(200).json({message: "Произошла ошибка!"})
    }
})
router.post('/deleteUser', async (req, res) => {
    try {
        const {username} = req.body
        await Role.deleteOne({username})
        
        res.json('Выбранный пользователь удален')
    } catch(e) {
        console.log(e)
        res.status(200).json({message: "Произошла ошибка!"})
    }
})

router.post('/getUser', async(req, res) => {
    try {
        const {username} = req.body
        const user = await User.aggregate([
            {   
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role'
                }
            },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'rooms',
                    foreignField: '_id',
                    as: 'rooms'
                }
            },
            {
                $match: {
                    username
                }
            }
        ])
        res.json(user)
    } catch(e) {
        console.log(e)
        res.status(200).json({message: "Произошла ошибка!"})
    }
})

router.get('/getUsers', async(req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role'
                }
            },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'rooms',
                    foreignField: '_id',
                    as: 'rooms'
                }
            }
        ])
        res.json(users)

    } catch(e) {
        console.log(e)
        res.status(200).json({message: "Произошла ошибка!"})
    }
})



router.post('/addRoom', async (req, res) => {
    try {
        const {title} = req.body 
        const room = new Room({title})
        await room.save()
        res.json(`Комната ${title} создана`)

    } catch(e) {
        console.log(e)
        res.status(200).json({message: "Произошла ошибка"})
    }
})

router.post('/deleteRoom', async (req, res) => {
    try {
        const {_id} = req.body
        await Room.deleteOne({_id})

        res.json('Выбранная комната удалена')
    } catch(e) {
        console.log(e)
        res.status(200).json({message: "Произошла ошибка"})
    }
})

router.post('/inviteRoom', async (req, res) => {
    try {
        const { userId, roomId } = req.body
        await User.updateOne(
            {_id: userId},
            {$push: {rooms: roomId}}
        )
        await Room.updateOne(
            {_id: roomId},
            {$push: {users: userId}}
        )
    
        res.json({message: 'Операция выполнена'})
    } catch(e) {
        console.log(e)
        res.status(200).json({message: "Произошла ошибка"})
    }
})

router.post('/addMessage', async (req, res) => {
    try {
        const { roomId, text, createAt, senderId} = req.body
        const message = new Message({text, createAt, senderId})
        
        await message.save()
        await Room.updateOne(
            {_id: roomId},
            {$push: {messages: message._id}}
        )

        res.json('Сообщение добавлено')
    } catch(e) {
        console.log(e)
        res.status(200).json('Произошла ошибка')
    }

})

router.post('/deleteMessage', (req, res) => {
    try {

    } catch(e) {
        console.log(e)
        res.status(200).json('Произошла ошибка')
    }

})

router.post('/roomGetMessages', async (req, res) => {
    try {
        const { _id } = req.body

        const messages = await Room.aggregate([
            // {
            //     $match: {
            //         _id
            //     }
            // },
            // {
            //     $$messages: {
            //         $lookup: {
            //             from: 'users',
            //             localField: 'senderId',
            //             foreignField: '_id',
            //             as: 'senderId'
            //         }
            //     }
            // }
        ])

        res.json({messages})

    } catch(e) {
        console.log(e)
        res.status(200).json('Произошла ошибка')
    }
})

module.exports = router