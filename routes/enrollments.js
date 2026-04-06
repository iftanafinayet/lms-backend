const express = require('express');
const { Course, Enrollment, User } = require('../models');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { serializeEnrollment } = require('../utils/serializers');

const router = express.Router();

router.use(auth);

router.post('/', requireRole('student', 'admin'), async (req, res) => {
  try {
    const course = await Course.findByPk(req.body.course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existing = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        courseId: req.body.course_id,
      },
    });

    if (existing) {
      return res.status(409).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      userId: req.user.id,
      courseId: req.body.course_id,
      status: 'active',
      progress: 0,
      enrollment_date: new Date(),
    });

    const createdEnrollment = await Enrollment.findByPk(enrollment.id, {
      include: [
        { model: Course, as: 'course', include: [{ model: User, as: 'instructor' }] },
        { model: User, as: 'user' },
      ],
    });

    res.status(201).json(serializeEnrollment(createdEnrollment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', requireRole('instructor', 'admin'), async (req, res) => {
  try {
    const courseInclude = {
      model: Course,
      as: 'course',
      include: [{ model: User, as: 'instructor' }],
    };
    if (req.user.role !== 'admin') {
      courseInclude.where = { instructor_id: req.user.id };
    }

    const enrollments = await Enrollment.findAll({
      include: [courseInclude, { model: User, as: 'user' }],
      order: [['createdAt', 'DESC']],
    });

    res.json(enrollments.map(serializeEnrollment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/my-enrollments', requireRole('student'), async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Course, as: 'course', include: [{ model: User, as: 'instructor' }] },
        { model: User, as: 'user' },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(enrollments.map(serializeEnrollment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
