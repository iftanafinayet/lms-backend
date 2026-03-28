const { sequelize, Enrollment, User, Course } = require('./models');

async function run() {
  console.log("Enrollment attributes:");
  console.log(Object.keys(Enrollment.rawAttributes));
  process.exit(0);
}
run();
