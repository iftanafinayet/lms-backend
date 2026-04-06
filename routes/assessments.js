const express = require('express');
const { Assessment } = require('../models');
const auth = require('../middleware/auth');
const { requireRole, requireCourseOwner, requireEnrolled } = require('../middleware/role');
const { serializeAssessment } = require('../utils/serializers');

const router = express.Router();

router.use(auth);

router.get(
  '/course/:courseId',
  [requireRole('student', 'instructor', 'admin'), requireEnrolled],
  async (req, res) => {
    try {
      const assessments = await Assessment.findAll({
        where: { course_id: req.params.courseId },
        order: [['due_date', 'ASC']],
      });

      res.json(assessments.map(serializeAssessment));
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
      const { title, due_date, max_score, course_id } = req.body;
      if (!title || !due_date || !max_score || !course_id) {
        return res.status(400).json({ error: 'Missing required assessment fields' });
      }

      const assessment = await Assessment.create({
        title,
        due_date,
        max_score,
        course_id,
      });

      res.status(201).json(serializeAssessment(assessment));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
