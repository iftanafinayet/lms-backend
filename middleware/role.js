module.exports = {
  requireRole: (...allowedRoles) => (req, res, next) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        required: allowedRoles.join(', '),
        yourRole: req.user?.role,
      });
    }
    next();
  },

  requireCourseOwner: async (req, res, next) => {
    const { Course } = req.app.locals.db;
    const courseId =
      req.params.id ||
      req.params.courseId ||
      req.body.course_id ||
      req.body.courseId;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (req.user.role !== 'admin' && course.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized for this course' });
    }

    req.course = course;
    next();
  },

  requireEnrolled: async (req, res, next) => {
    const { Course, Enrollment } = req.app.locals.db;
    const courseId = req.params.courseId || req.params.id || req.body.course_id;

    if (!courseId) {
      return res.status(400).json({ error: 'Course id is required' });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    if (req.user.role === 'instructor') {
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      if (course.instructor_id !== req.user.id) {
        return res
          .status(403)
          .json({ error: 'Not authorized for this course' });
      }
      req.course = course;
      return next();
    }

    const enrollment = await Enrollment.findOne({
      where: { userId: req.user.id, courseId },
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in course' });
    }

    req.enrollment = enrollment;
    next();
  },
};
