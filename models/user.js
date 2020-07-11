const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    win_count: {
        type: Number,
        default: 0
    },
    total_game_count: {
        type: Number,
        default: 0
    },
    win_rate: {
        type: Number,
        default: null
    },
    sum: {
        type: Number,
        default: 0
    },
    total_round_count: {
        type: Number,
        default: 0
    },
    win_min_round: {
        type: Number,
        default: null
    },
    win_avg_round: {
        type: Number,
        default: null
    },
    max_3_darts: {
        type: Number,
        default: 0
    },
    avg_3_darts: {
        type: Number,
        default: null
    },
    triple: {
        type: Number,
        default: 0
    },
    double: {
        type: Number,
        default: 0
    },
    single: {
        type: Number,
        default: 0
    },
    missed: {
        type: Number,
        default: 0
    },
    bust: {
        type: Number,
        default: 0
    },
    bullseye: {
        type: Number,
        default: 0
    },
    total_dart_count: {
        type: Number,
        default: 0
    },
    spot_count: {
        type: Array,
        default: []
    },
    spots: {
        type: Array,
        default: []
    }
})

userSchema.pre('validate', function (next) {
    if (this.total_game_count != 0){
        this.win_rate = this.win_count / this.total_game_count
    }
    next()
})

module.exports = mongoose.model('User', userSchema)