const express = require('express')
const router = express.Router()
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
router.post('/', async (req, res) => {
    const score = new Score({
        name: req.body.name,
        score_count: 0,
        scores: []
    })
    try {
        const newScore = await score.save()
        res.status(201).json(newScore)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
  })

// Updating one
router.patch('/:id', getScore, async (req, res) => {
    if (req.body.name != null){
        res.score.name = req.body.name
    }
    if (req.body.scores != null){
        res.score.scores.push(req.body.scores)
        res.score.score_count++
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

module.exports = router