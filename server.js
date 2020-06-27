require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(express.static(__dirname + '/public'))

app.engine('html', ejs.__express)
app.set('view engine', 'html')

const indexRouter = require('./routes/')
const usersRouter = require('./routes/users')
const scoresRouter = require('./routes/scores')
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/scores', scoresRouter)

app.listen(3000, () => console.log('Server started'))