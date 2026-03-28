module.exports = {
    requireRole: (...allowedRoles) => (req, res, next) => {
        if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Forbidden',
                required: allowedRoles.join(', '),
                yourRole: req.user?.role
            });
        }
        next();
    },

    requireCourseOwner: async (req, res, next) => {
        const { Course } = req.app.locals.db;
        const course = await Course.findByPk(req.params.id || req.params.courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        if (req.user.role !== 'admin' && course.instructor_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized for this course' });
        }
        req.course = course;
        next();
    },

    requireEnrolled: async (req, res, next) => {
        if (req.user.role === 'admin' || req.user.role === 'instructor') {
            return next();
        }
        const { Enrollment } = req.app.locals.db;
        const enrollment = await Enrollment.findOne({
            where: { userId: req.user.id, courseId: req.params.courseId || req.params.id }
        });
        if (!enrollment) return res.status(403).json({ error: 'Not enrolled in course' });
        req.enrollment = enrollment;
        next();
    }
};
