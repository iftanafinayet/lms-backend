'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Enrollment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Enrollment.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
    }
  }
  Enrollment.init({
    enrollment_date: DataTypes.DATE,
    status: DataTypes.STRING,
    progress: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Enrollment',
  });
  return Enrollment;
};