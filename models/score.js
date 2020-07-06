// tag 0-missed 1-single 2-double 3-triple 25-bullseye 50-bullseye 99-bust

const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    },
    game: {
        type: Number,
        required: true
    },
    round_count: Number,
    score_count: Number,
    scores: [[{
        score: {
            type: Number,
            // enum:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,50]
        },
        tag: {
            type: Number,
            // enum: [0,1,2,3,25,50,99]
        }
    }]]
})

scoreSchema.pre('validate', function (next) {
    this.round_count = this.scores.length
    let score_counter = 0
    for (let i = 0; i < this.scores.length; i++){
        score_counter += scores[i].length
    }
    this.score_count = score_counter
    next()
})

module.exports = mongoose.model('Score', scoreSchema)