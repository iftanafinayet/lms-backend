'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
      Submission.belongsTo(models.Enrollment, { foreignKey: 'enrollment_id' });
      Submission.belongsTo(models.Assessment, { foreignKey: 'assessment_id' });
      Submission.hasOne(models.Grade, { foreignKey: 'submission_id' });
    }
  }
  Submission.init({
    file_url: { type: DataTypes.STRING }, // Google Drive/S3 link
    submitted_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    enrollment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Enrollments', key: 'id' }
    },
    assessment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Assessments', key: 'id' }
    }
  }, { sequelize, modelName: 'Submission' });
  return Submission;
};
