'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Course, { foreignKey: 'instructor_id', as: 'taughtCourses' });
      User.belongsToMany(models.Course, { through: models.Enrollment, as: 'enrolledCourses' });
    }
  }
  User.init({
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('student', 'instructor', 'admin'), allowNull: false },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false }
  }, { sequelize, modelName: 'User' });

  User.beforeCreate(async (user) => {
    const bcrypt = require('bcryptjs');
    user.password = await bcrypt.hash(user.password, 12);
  });

  return User;
};
