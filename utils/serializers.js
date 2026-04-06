function asPlain(model) {
  if (!model) {
    return null;
  }

  return typeof model.toJSON === 'function' ? model.toJSON() : model;
}

function serializeUser(user) {
  const raw = asPlain(user);
  if (!raw) {
    return null;
  }

  return {
    id: raw.id,
    email: raw.email,
    username: raw.username,
    role: raw.role,
    first_name: raw.first_name,
    last_name: raw.last_name,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function serializeCourse(course) {
  const raw = asPlain(course);
  if (!raw) {
    return null;
  }

  const enrolledStudents = raw.enrolled_students ??
    (Array.isArray(raw.students) ? raw.students.length : 0);

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    instructor_id: raw.instructor_id,
    instructor: serializeUser(raw.instructor),
    instructor_name: raw.instructor
      ? `${raw.instructor.first_name || ''} ${raw.instructor.last_name || ''}`.trim()
      : 'Unknown',
    enrolled_students: enrolledStudents,
    start_date: raw.start_date || '',
    end_date: raw.end_date || '',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function serializeEnrollment(enrollment) {
  const raw = asPlain(enrollment);
  if (!raw) {
    return null;
  }

  return {
    id: raw.id,
    userId: raw.userId,
    student_id: raw.userId,
    courseId: raw.courseId,
    course_id: raw.courseId,
    enrollment_date: raw.enrollment_date || raw.createdAt,
    status: raw.status,
    progress: raw.progress || 0,
    user: serializeUser(raw.user),
    course: serializeCourse(raw.course),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function serializeContent(content) {
  const raw = asPlain(content);
  if (!raw) {
    return null;
  }

  return {
    id: raw.id,
    title: raw.title,
    type: raw.type,
    url: raw.url,
    course_id: raw.course_id,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function serializeAssessment(assessment) {
  const raw = asPlain(assessment);
  if (!raw) {
    return null;
  }

  return {
    id: raw.id,
    title: raw.title,
    due_date: raw.due_date,
    max_score: raw.max_score,
    course_id: raw.course_id,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function serializeGrade(grade) {
  const raw = asPlain(grade);
  if (!raw) {
    return null;
  }

  return {
    id: raw.id,
    score: raw.score,
    feedback: raw.feedback,
    submission_id: raw.submission_id,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function serializeSubmission(submission) {
  const raw = asPlain(submission);
  if (!raw) {
    return null;
  }

  const student = raw.student || raw.enrollment?.user;
  const grade = raw.gradeRecord || raw.grade || raw.Grade;
  const studentName = student
    ? `${student.first_name || ''} ${student.last_name || ''}`.trim() || student.username
    : 'Student';

  return {
    id: raw.id,
    assessment_id: raw.assessment_id,
    enrollment_id: raw.enrollment_id,
    file_url: raw.file_url,
    submitted_date: raw.createdAt,
    student_id: student?.id || raw.student_id || raw.enrollment?.userId || '',
    student_name: studentName,
    student: serializeUser(student),
    enrollment: serializeEnrollment(raw.enrollment),
    assessment: serializeAssessment(raw.assessment),
    grade: serializeGrade(grade),
    score: grade?.score ?? raw.grade ?? null,
    feedback: grade?.feedback ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

module.exports = {
  serializeAssessment,
  serializeContent,
  serializeCourse,
  serializeEnrollment,
  serializeGrade,
  serializeSubmission,
  serializeUser,
};
