const { sequelize } = require('./models');
sequelize.query('DESCRIBE Enrollments;').then(([res]) => {
  console.log("SCHEMA:", res.map(r => r.Field));
  process.exit(0);
}).catch(e => {
  console.log("ERR:", e.message);
  process.exit(1);
});
