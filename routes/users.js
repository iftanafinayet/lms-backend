const express = require('express');
const { Enrollment, Submission, Grade, User } = require('../models');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { serializeUser } = require('../utils/serializers');

const router = express.Router();

router.use(auth);

router.get('/', requireRole('instructor', 'admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['first_name', 'ASC'], ['last_name', 'ASC']],
    });
    res.json(users.map(serializeUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const user = await User.findByPk(req.params.id, {
      include: ['taughtCourses', 'enrolledCourses'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'instructor' && user.taughtCourses?.length) {
      return res.status(409).json({
        error: 'Delete or reassign this instructor\'s courses before removing the account',
      });
    }

    const enrollments = await Enrollment.findAll({
      where: { userId: user.id },
    });

    for (const enrollment of enrollments) {
      const submissions = await Submission.findAll({
        where: { enrollment_id: enrollment.id },
      });

      for (const submission of submissions) {
        await Grade.destroy({ where: { submission_id: submission.id } });
      }

      await Submission.destroy({ where: { enrollment_id: enrollment.id } });
    }

    await Enrollment.destroy({ where: { userId: user.id } });
    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
