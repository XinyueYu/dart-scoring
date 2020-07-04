const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    win_count: Number,
    total_count: Number,
    win_rate: Number,
    sum: Number,
    total_round_count: Number,
    win_min_round: Number,
    win_avg_round: Number,
    max_3_darts: Number,
    avg_3_darts: Number,
    triple: Number,
    double: Number,
    single: Number,
    missed: Number,
    bust: Number,
    bullseye: Number
})

module.exports = mongoose.model('User', userSchema)