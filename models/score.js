const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    name: String,
    scores: [[[Number]]]
})

module.exports = mongoose.model('Score', scoreSchema)