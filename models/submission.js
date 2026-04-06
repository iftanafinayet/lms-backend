'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
      Submission.belongsTo(models.Enrollment, {
        foreignKey: 'enrollment_id',
        as: 'enrollment',
      });
      Submission.belongsTo(models.Assessment, {
        foreignKey: 'assessment_id',
        as: 'assessment',
      });
      Submission.hasOne(models.Grade, {
        foreignKey: 'submission_id',
        as: 'gradeRecord',
      });
    }
  }

  Submission.init(
    {
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      grade: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      enrollment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Enrollments', key: 'id' },
      },
      assessment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Assessments', key: 'id' },
      },
    },
    { sequelize, modelName: 'Submission' }
  );

  return Submission;
};
