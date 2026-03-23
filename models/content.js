'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    static associate(models) {
      Content.belongsTo(models.Course, { foreignKey: 'course_id' });
    }
  }
  Content.init({
    title: { type: DataTypes.STRING, allowNull: false },
    type: {
      type: DataTypes.ENUM('video', 'document', 'quiz', 'assignment'),
      defaultValue: 'document'
    },
    url: { type: DataTypes.STRING }, // S3/Google Drive link
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Courses', key: 'id' }
    }
  }, { sequelize, modelName: 'Content' });
  return Content;
};
