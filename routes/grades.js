const express = require('express');
const { Assessment, Course, Enrollment, Grade, Submission, User } = require('../models');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { serializeGrade, serializeSubmission } = require('../utils/serializers');

const router = express.Router();

router.use(auth);

router.get('/course/:courseId/my-grades', requireRole('student', 'admin'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        courseId: req.params.courseId,
      },
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    const submissions = await Submission.findAll({
      where: { enrollment_id: enrollment.id },
      include: [
        { model: Grade, as: 'gradeRecord' },
        { model: Assessment, as: 'assessment' },
        {
          model: Enrollment,
          as: 'enrollment',
          include: [{ model: User, as: 'user' }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(submissions.map(serializeSubmission));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', requireRole('instructor', 'admin'), async (req, res) => {
  try {
    const { submission_id, score, feedback } = req.body;
    if (!submission_id || score === undefined) {
      return res.status(400).json({ error: 'submission_id and score are required' });
    }

    const submission = await Submission.findByPk(submission_id, {
      include: [{ model: Assessment, as: 'assessment' }],
    });

    if (!submission || !submission.assessment) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const course = await Course.findByPk(submission.assessment.course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (req.user.role === 'instructor' && course.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to grade this submission' });
    }

    const numericScore = Number(score);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > submission.assessment.max_score) {
      return res.status(400).json({
        error: `Score must be between 0 and ${submission.assessment.max_score}`,
      });
    }

    const existingGrade = await Grade.findOne({ where: { submission_id } });
    let grade;
    if (existingGrade) {
      grade = await existingGrade.update({
        score: numericScore,
        feedback: feedback || null,
      });
    } else {
      grade = await Grade.create({
        submission_id,
        score: numericScore,
        feedback: feedback || null,
      });
    }

    await submission.update({ grade: numericScore });

    res.status(201).json(serializeGrade(grade));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
