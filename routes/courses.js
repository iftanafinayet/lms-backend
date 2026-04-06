const express = require('express');
const { Course, User } = require('../models');
const auth = require('../middleware/auth');
const { requireRole, requireCourseOwner } = require('../middleware/role');
const { serializeCourse } = require('../utils/serializers');

const router = express.Router();

router.use(auth);

router.get(
  '/',
  requireRole('student', 'instructor', 'admin'),
  async (req, res) => {
    try {
      const courses = await Course.findAll({
        include: [
          { model: User, as: 'instructor' },
          { model: User, as: 'students', through: { attributes: [] } },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.json(courses.map(serializeCourse));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/my-courses', requireRole('instructor', 'admin'), async (req, res) => {
  try {
    const where = req.user.role === 'admin'
      ? {}
      : { instructor_id: req.user.id };

    const courses = await Course.findAll({
      where,
      include: [
        { model: User, as: 'instructor' },
        { model: User, as: 'students', through: { attributes: [] } },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(courses.map(serializeCourse));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', requireRole('instructor', 'admin'), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const course = await Course.create({
      name,
      description,
      instructor_id: req.user.id,
    });

    const createdCourse = await Course.findByPk(course.id, {
      include: [
        { model: User, as: 'instructor' },
        { model: User, as: 'students', through: { attributes: [] } },
      ],
    });

    res.status(201).json(serializeCourse(createdCourse));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put(
  '/:id',
  [requireRole('instructor', 'admin'), requireCourseOwner],
  async (req, res) => {
    try {
      const updates = {};
      if (typeof req.body.name === 'string' && req.body.name.trim()) {
        updates.name = req.body.name.trim();
      }
      if (typeof req.body.description === 'string') {
        updates.description = req.body.description.trim();
      }

      await req.course.update(updates);

      const updatedCourse = await Course.findByPk(req.course.id, {
        include: [
          { model: User, as: 'instructor' },
          { model: User, as: 'students', through: { attributes: [] } },
        ],
      });

      res.json(serializeCourse(updatedCourse));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  '/:id',
  [requireRole('instructor', 'admin'), requireCourseOwner],
  async (req, res) => {
    try {
      await req.course.destroy();
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
