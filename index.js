require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')
const io = require('socket.io')

const authRouter = require('./routers/authRouter.js')
const dbRouter = require('./routers/dbRouter.js')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.use('/auth', authRouter)
app.use('/db', dbRouter)

const start = async () => {
	await mongoose.connect(
		process.env.DB_URL, 
		{ 
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

start()