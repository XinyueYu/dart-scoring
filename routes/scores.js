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
router.post('/', getUser, async (req, res) => {

    const score = new Score({
        userId: req.body.userId,
        rival_userId: req.body.rival_userId,
        game: req.body.game,
        isWin: req.body.isWin,
        total_score: req.body.total_score,
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
        // const newScore = await score.save()
        // res.status(201).json(newScore)
        await score.save()
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

    let highest_three = []
    let spots
    try {
        spots = await Score.aggregate([
            {
                $match: { userId: res.user._id }
            },{
                $project: { _id: 0, scores: 1 }
            },{
                $unwind: '$scores'
            },{
                $unwind: '$scores'
            },{
                $match: { "scores.tag" : { $ne: 99 } }
            },{
                $sortByCount: '$scores.score'
            }
        ])
        for (let i = 0; i < 3 && i < spots.length; i++) {
            highest_three.push(spots[i]._id)
        }
    } catch (err) {
        return res.json({ message: err.message })
    }

    if (spots.length != 0){
        res.user.spots = highest_three
        res.user.spot_count = spots.sort((a,b) => (a._id - b._id))
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }

})

// Updating one
router.patch('/:id', getScore, async (req, res) => {
    if (req.body.userId != null){
        res.score.userId = req.body.userId
    }
    if (req.body.rival_userId != null){
        res.score.rival_userId = req.body.rival_userId
    }
    if (req.body.isWin != null){
        res.score.isWin = req.body.isWin
    }
    if (req.body.total_score != null){
        res.score.total_score = req.body.total_score
    }
    if (req.body.scores_in_3_darts != null){
        res.score.scores_in_3_darts = req.body.scores_in_3_darts
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

async function getUser(req, res, next){
    let user
    try {
        user = await User.findById(req.body.userId)
        if (user == null){
            return res.status(404).json({ message: 'Cannot find user for this score' })
        }
    } catch (err) {
        return console.log(err.message)
    }
    
    res.user = user
    next()
}

module.exports = router