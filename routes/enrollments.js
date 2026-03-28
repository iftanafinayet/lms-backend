const express = require('express');
const { Enrollment } = require('../models');
const auth = require('../middleware/auth');
const { requireRole, requireEnrolled } = require('../middleware/role');
const router = express.Router();

// Debug - Lihat schema Enrollments
router.get('/debug', async (req, res) => {
    const [results] = await req.app.locals.db.sequelize.query('DESCRIBE Enrollments;');
    res.json(results);
});

router.use(auth);

// Student enroll to course
router.post('/', requireRole('student', 'admin'), async (req, res) => {
    try {
        const enrollment = await Enrollment.create({
            userId: req.user.id,  // Dari token
            courseId: req.body.course_id,
            status: 'active',
            progress: 0
        });
        res.status(201).json(enrollment);
    } catch (error) {
        console.error('Enrollment Create Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Admin / Instructor GET all enrollments
router.get('/', requireRole('instructor', 'admin'), async (req, res) => {
    const enrollments = await Enrollment.findAll({
        include: 'course'
    });
    res.json(enrollments);
});

// Lihat enrollment sendiri
router.get('/my-enrollments', requireRole('student'), async (req, res) => {
    const enrollments = await Enrollment.findAll({
        where: { userId: req.user.id },
        include: 'course'
    });
    res.json(enrollments);
});

module.exports = router;
