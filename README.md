# LMS Backend

A robust backend REST API for a Learning Management System (LMS) built with Node.js, Express, and MySQL (via Sequelize ORM). 

## 🚀 Technologies

- **Node.js & Express.js** - Web framework for the backend application
- **Sequelize** - Promise-based Node.js ORM for SQL databases
- **MySQL** - Relational Database (via `mysql2` driver)
- **JWT (JSON Web Tokens)** - Secure authentication and authorization
- **Bcrypt.js** - Secure password hashing
- **Morgan & Helmet** - HTTP request logging and API security headers

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:
* [Node.js](https://nodejs.org/) installed (v16.x or higher recommended)
* [MySQL](https://www.mysql.com/) installed and running locally or remotely

## 🛠️ Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/iftanafinayet/lms-backend.git
   cd lms-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and configure the variables required for the project. For example:
   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASS=your_db_password
   DB_NAME=lms_db
   JWT_SECRET=your_super_secret_key
   ```

4. **Database Initialization**:
   Ensure your MySQL server is running, then create the database and run migrations via the Sequelize CLI:
   ```bash
   # Create the database (if not already created manually)
   npx sequelize-cli db:create

   # Run all database migrations
   npx sequelize-cli db:migrate

   # (Optional) Seed the database with initial default data
   npx sequelize-cli db:seed:all
   ```

## 💻 Running the Application

To start the server in development mode (using nodemon for auto-reloading):
```bash
npx nodemon server.js
```

To run the server normally:
```bash
node server.js
```

The API should now be running on `http://localhost:3000` (or the port defined in your `.env` file).

## 📁 Project Structure

```
lms-backend/
├── config/         # Sequelize database configuration files
├── middleware/     # Custom Express middlewares (e.g., Auth verification, validation)
├── migrations/     # Sequelize database migration scripts
├── models/         # Sequelize ORM models defining database schemas
├── routes/         # Express API route handlers
├── seeders/        # Initial database seed data scripts
├── .env            # Environment variables (ignored by Git)
├── package.json    # Project metadata, dependencies, and NPM scripts
└── server.js       # Main application entry point and server setup
```

## 🔒 License

This project is licensed under the ISC License.
