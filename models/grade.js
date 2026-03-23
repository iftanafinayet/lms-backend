'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    static associate(models) {
      Grade.belongsTo(models.Submission, { foreignKey: 'submission_id' });
    }
  }
  Grade.init({
    score: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 100 }
    },
    feedback: DataTypes.TEXT,
    submission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: 'Submissions', key: 'id' }
    }
  }, { sequelize, modelName: 'Grade' });
  return Grade;
};
