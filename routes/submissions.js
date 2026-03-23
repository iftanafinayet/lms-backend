const express = require('express');
const { Submission } = require('../models');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const submission = await Submission.create(req.body);
        res.status(201).json(submission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/enrollment/:enrollmentId', async (req, res) => {
    const submissions = await Submission.findAll({
        where: { enrollment_id: req.params.enrollmentId },
        include: 'assessment'
    });
    res.json(submissions);
});

module.exports = router;
