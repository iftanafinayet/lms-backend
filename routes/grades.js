const express = require('express');
const { Grade } = require('../models');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const grade = await Grade.create(req.body);
        res.status(201).json(grade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
