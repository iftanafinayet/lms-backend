const express = require('express');
const { Course, User } = require('../models');
const auth = require('../middleware/auth');
const { requireRole, requireCourseOwner } = require('../middleware/role');
const router = express.Router();

router.use(auth);

// 1. GET all courses - semua role boleh
router.get('/', requireRole('student', 'instructor', 'admin'), async (req, res) => {
    const courses = await Course.findAll({
        include: [{ model: User, as: 'instructor' }]
    });
    res.json(courses);
});

// 2. POST new course - instructor/admin only
router.post('/', requireRole('instructor', 'admin'), async (req, res) => {
    const course = await Course.create({
        name: req.body.name,
        description: req.body.description,
        instructor_id: req.user.id
    });
    res.status(201).json(course);
});

// 3. PUT update course - owner only
router.put('/:id', [
    requireRole('instructor', 'admin'),
    requireCourseOwner
], async (req, res) => {
    await req.course.update(req.body);
    res.json(req.course);
});

// 4. GET own courses - instructor
router.get('/my-courses', [
    auth,
    requireRole('instructor')
], async (req, res) => {
    const courses = await Course.findAll({
        where: { instructor_id: req.user.id },
        include: 'students'
    });
    res.json(courses);
});

module.exports = router;
