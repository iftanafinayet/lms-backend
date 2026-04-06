const express = require('express');
const { Content } = require('../models');
const auth = require('../middleware/auth');
const { requireRole, requireCourseOwner, requireEnrolled } = require('../middleware/role');
const { serializeContent } = require('../utils/serializers');

const router = express.Router();

router.use(auth);

router.get(
  '/course/:courseId',
  [requireRole('student', 'instructor', 'admin'), requireEnrolled],
  async (req, res) => {
    try {
      const contents = await Content.findAll({
        where: { course_id: req.params.courseId },
        order: [['createdAt', 'ASC']],
      });

      res.json(contents.map(serializeContent));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  '/',
  [requireRole('instructor', 'admin'), requireCourseOwner],
  async (req, res) => {
    try {
      const { title, type, url, course_id } = req.body;
      if (!title || !type || !url || !course_id) {
        return res.status(400).json({ error: 'Missing required content fields' });
      }

      const content = await Content.create({ title, type, url, course_id });
      res.status(201).json(serializeContent(content));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
