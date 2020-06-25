const express = require('express')
const router = express.Router()
const User = require('../models/user')

// Getting all
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Getting one
router.get('/:id', getUser, async (req, res) => {
    res.json(res.user)
})

// Creating one
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        win_count: 0,
        total_count: 0,
        win_rate: null,
        sum: 0,
        total_round_count: 0,
        win_min_round: null,
        win_avg_round: null,
        max_3_darts: 0,
        avg_3_darts: null,
        triple: 0,
        double: 0,
        single: 0,
        missed: 0,
        bust: 0,
        bullseye: 0
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
  })

// Updating one
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name
    }
    if (req.body.win_count != null) {
        res.user.win_count = req.body.win_count
    }
    if (req.body.total_count != null) {
        res.user.total_count = req.body.total_count
    }
    if (req.body.win_rate != null) {
        res.user.win_rate = req.body.win_rate
    }
    if (req.body.sum != null) {
        res.user.sum = req.body.sum
    }
    if (req.body.total_round_count != null) {
        res.user.total_round_count = req.body.total_round_count
    }
    if (req.body.win_min_round != null) {
        res.user.win_min_round = req.body.win_min_round
    }
    if (req.body.win_avg_round != null) {
        res.user.win_avg_round = req.body.win_avg_round
    }
    if (req.body.max_3_darts != null) {
        res.user.max_3_darts = req.body.max_3_darts
    }
    if (req.body.avg_3_darts != null) {
        res.user.avg_3_darts = req.body.avg_3_darts
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting one
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({ message: 'Deleted User' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
  
    res.user = user
    next()
  }

module.exports = router