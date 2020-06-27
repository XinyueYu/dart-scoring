// tag 0-missed 1-single 2-double 3-triple 25-bullseye 50-bullseye 99-bust

const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    name: String,
    score_count: Number,
    scores: [{
        _id: false,
        score: Number,
        tag: Number
    }]
})

module.exports = mongoose.model('Score', scoreSchema)