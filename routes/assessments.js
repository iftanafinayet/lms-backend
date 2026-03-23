const express = require('express');
const { Assessment } = require('../models');
const router = express.Router();

router.get('/course/:courseId', async (req, res) => {
    const assessments = await Assessment.findAll({ where: { course_id: req.params.courseId } });
    res.json(assessments);
});

router.post('/', async (req, res) => {
    const assessment = await Assessment.create(req.body);
    res.status(201).json(assessment);
});

module.exports = router;
