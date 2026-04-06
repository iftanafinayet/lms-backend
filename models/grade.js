'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    static associate(models) {
      Grade.belongsTo(models.Submission, {
        foreignKey: 'submission_id',
        as: 'submission',
      });
    }
  }

  Grade.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 1000 },
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      submission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Submissions', key: 'id' },
      },
    },
    { sequelize, modelName: 'Grade' }
  );

  return Grade;
};
