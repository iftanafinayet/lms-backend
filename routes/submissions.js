const express = require('express');
const { Assessment, Course, Enrollment, Grade, Submission, User } = require('../models');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { serializeSubmission } = require('../utils/serializers');

const router = express.Router();

router.use(auth);

async function loadSubmission(submissionId) {
  return Submission.findByPk(submissionId, {
    include: [
      { model: Grade, as: 'gradeRecord' },
      {
        model: Enrollment,
        as: 'enrollment',
        include: [{ model: User, as: 'user' }],
      },
      {
        model: Assessment,
        as: 'assessment',
      },
    ],
  });
}

router.post('/', requireRole('student', 'admin'), async (req, res) => {
  try {
    const { assessment_id, file_url } = req.body;
    if (!assessment_id || !file_url) {
      return res.status(400).json({ error: 'Assessment and submission URL are required' });
    }

    const assessment = await Assessment.findByPk(assessment_id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const enrollment = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        courseId: assessment.course_id,
      },
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'You are not enrolled in this course' });
    }

    const existing = await Submission.findOne({
      where: {
        enrollment_id: enrollment.id,
        assessment_id,
      },
    });

    if (existing) {
      return res.status(409).json({ error: 'Submission already exists for this assessment' });
    }

    const submission = await Submission.create({
      file_url,
      enrollment_id: enrollment.id,
      assessment_id,
    });

    const createdSubmission = await loadSubmission(submission.id);
    res.status(201).json(serializeSubmission(createdSubmission));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/assessment/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const course = await Course.findByPk(assessment.course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const where = { assessment_id: assessment.id };

    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        where: {
          userId: req.user.id,
          courseId: course.id,
        },
      });

      if (!enrollment) {
        return res.status(403).json({ error: 'Not enrolled in this course' });
      }

      where.enrollment_id = enrollment.id;
    }

    if (req.user.role === 'instructor' && course.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized for this assessment' });
    }

    const submissions = await Submission.findAll({
      where,
      include: [
        { model: Grade, as: 'gradeRecord' },
        {
          model: Enrollment,
          as: 'enrollment',
          include: [{ model: User, as: 'user' }],
        },
        {
          model: Assessment,
          as: 'assessment',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(submissions.map(serializeSubmission));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:submissionId/grade', requireRole('instructor', 'admin'), async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const submission = await loadSubmission(req.params.submissionId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const assessment = await Assessment.findByPk(submission.assessment_id);
    const course = assessment
      ? await Course.findByPk(assessment.course_id)
      : null;

    if (!assessment || !course) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    if (req.user.role === 'instructor' && course.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to grade this submission' });
    }

    const numericScore = Number(score);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > assessment.max_score) {
      return res.status(400).json({
        error: `Score must be between 0 and ${assessment.max_score}`,
      });
    }

    const existingGrade = await Grade.findOne({
      where: { submission_id: submission.id },
    });

    if (existingGrade) {
      await existingGrade.update({
        score: numericScore,
        feedback: feedback || null,
      });
    } else {
      await Grade.create({
        score: numericScore,
        feedback: feedback || null,
        submission_id: submission.id,
      });
    }

    await submission.update({ grade: numericScore });

    const gradedSubmission = await loadSubmission(submission.id);
    res.json(serializeSubmission(gradedSubmission));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
