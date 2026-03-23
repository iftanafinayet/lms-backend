const express = require('express');
const { Enrollment } = require('../models');
const auth = require('../middleware/auth');
const { requireRole, requireEnrolled } = require('../middleware/role');
const router = express.Router();

router.use(auth);

// Student enroll to course
router.post('/', requireRole('student', 'admin'), async (req, res) => {
    const enrollment = await Enrollment.create({
        user_id: req.user.id,  // Dari token
        course_id: req.body.course_id,
        status: 'active',
        progress: 0
    });
    res.status(201).json(enrollment);
});

// Lihat enrollment sendiri
router.get('/my-enrollments', requireRole('student'), async (req, res) => {
    const enrollments = await Enrollment.findAll({
        where: { user_id: req.user.id },
        include: 'course'
    });
    res.json(enrollments);
});

module.exports = router;
