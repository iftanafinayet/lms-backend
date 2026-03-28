'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Clean up any existing demo users first
    await queryInterface.bulkDelete('Users', {
      [Sequelize.Op.or]: [
        { email: 'john.student@university.edu' },
        { email: 'jane.instructor@university.edu' },
        { email: 'admin@university.edu' },
        { username: 'johndoe' },
        { username: 'janesmith' },
        { username: 'admin' },
      ],
    });

    await queryInterface.bulkInsert('Users', [
      {
        email: 'john.student@university.edu',
        username: 'johndoe',
        password: hashedPassword,
        role: 'student',
        first_name: 'John',
        last_name: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'jane.instructor@university.edu',
        username: 'janesmith',
        password: hashedPassword,
        role: 'instructor',
        first_name: 'Jane',
        last_name: 'Smith',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'admin@university.edu',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: [
        'john.student@university.edu',
        'jane.instructor@university.edu',
        'admin@university.edu',
      ],
    });
  },
};
