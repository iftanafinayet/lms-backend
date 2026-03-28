const mysql = require('mysql2/promise');

async function main() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'basketismylife',
      database: 'lms_univ'
    });
    const [rows] = await connection.execute('DESCRIBE Enrollments');
    console.log("COLUMNS:", rows.map(r => r.Field));
    await connection.end();
  } catch (e) {
    console.error(e);
  }
}
main();
