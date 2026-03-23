const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, username, password, role, first_name, last_name } = req.body;

    // Admin only boleh register instructor/admin
    const allowedRoles = ['student'];
    if (role && !['student', 'instructor', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User exists' });

    const user = await User.create({ email, username, password, role, first_name, last_name });

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role }
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role }
    });
});

module.exports = router;
