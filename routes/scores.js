const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Score = require('../models/score')

// Getting all
router.get('/', async (req, res) => {
    try {
        const scores = await Score.find()
        res.json(scores)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Getting one
router.get('/:id', getScore, async (req, res) => {
    res.json(res.score)
})

// Creating one
router.post('/', getRoundCount, async (req, res) => {
    const score = new Score({
        userId: req.body.userId,
        game: res.total_game_count,
        scores_in_3_darts: req.body.scores_in_3_darts
    })
    for (let i = 0; i < req.body.scores.length; i++){
        score.scores.push([])
        for (let j = 0; j < req.body.scores[i].length; j++){
            score.scores[i].push({
                score: req.body.scores[i][j],
                tag: req.body.tags[i][j]
            })
        }
    }
    try {
        const newScore = await score.save()
        res.status(201).json(newScore)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
  })

// Updating one
router.patch('/:id', getScore, async (req, res) => {
    if (req.body.userId != null){
        res.score.userId = req.body.userId
    }
    if (req.body.round_count != null){
        res.score.round_count = req.body.round_count
    }
    try {
        const updatedScore = await res.score.save()
        res.json(updatedScore)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting one
router.delete('/:id', getScore, async (req, res) => {
    try {
        await res.score.remove()
        res.json({ message: 'Deleted Score' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getScore(req, res, next) {
    let score
    try {
        score = await Score.findById(req.params.id)
        if (score == null) {
            return res.status(404).json({ message: 'Cannot find score' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
  
    res.score = score
    next()
  }

async function getRoundCount(req, res, next){
    let user
    try {
        user = await User.findById(req.body.userId)
        if (user == null){
            return res.status(404).json({ message: 'Cannot find user for this score' })
        }
    } catch (err) {
        return console.log(err.message)
    }

    res.total_game_count = user.total_game_count
    next()
}

module.exports = router