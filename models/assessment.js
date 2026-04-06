'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assessment extends Model {
    static associate(models) {
      Assessment.belongsTo(models.Course, { foreignKey: 'course_id' });
      Assessment.hasMany(models.Submission, {
        foreignKey: 'assessment_id',
        as: 'submissions',
      });
    }
  }
  Assessment.init({
    title: { type: DataTypes.STRING, allowNull: false },
    due_date: DataTypes.DATE,
    max_score: { type: DataTypes.INTEGER, defaultValue: 100 },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Courses', key: 'id' }
    }
  }, { sequelize, modelName: 'Assessment' });
  return Assessment;
};
