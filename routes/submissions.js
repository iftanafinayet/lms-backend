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

router.get('/assessment/:assessmentId', async (req, res) => {
    const submissions = await Submission.findAll({
        where: { assessment_id: req.params.assessmentId },
        include: 'Grade' // include grade if needed, or adapt to what frontend expects
    });
    res.json(submissions);
});

module.exports = router;
