require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'University LMS Backend Ready' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/contents', require('./routes/content'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/grades', require('./routes/grades'));

const db = require('./models');
app.locals.db = db;

app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
});
