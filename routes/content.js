const express = require('express');
const { Content } = require('../models');
const auth = require('../middleware/auth');
const { requireRole, requireEnrolled } = require('../middleware/role');
const router = express.Router();

router.get('/course/:courseId', [
    auth,
    requireRole('student', 'instructor', 'admin'),
    requireEnrolled
], async (req, res) => {
    const contents = await Content.findAll({
        where: { course_id: req.params.courseId }
    });
    res.json(contents);
});

router.post('/', async (req, res) => {
    const content = await Content.create(req.body);
    res.status(201).json(content);
});

module.exports = router;
