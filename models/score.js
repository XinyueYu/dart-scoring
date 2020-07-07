// tag 0-missed 1-single 2-double 3-triple 25-bullseye 50-bullseye 99-bust

const mongoose = require('mongoose')

const singleScoreSchema = new mongoose.Schema({
    _id: false,
    score: {
        type: Number,
        enum:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,50]
    },
    tag: {
        type: Number,
        enum: [0,1,2,3,25,50,99]
    }
})

const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    },
    game: Number,
    scores: [[singleScoreSchema]],
    scores_in_3_darts: [Number]
},{
    timestamps: {createdAt: true, updatedAt: false } // When you call Date#toString(), the JavaScript runtime will use your OS' timezone.
})

// scoreSchema.pre('validate', function (next) {
//     this.score_count = this.scores.length
//     next()
// })

module.exports = mongoose.model('Score', scoreSchema)