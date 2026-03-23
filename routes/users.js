const express = require('express');
const router = express.Router();
const { User } = require('../models');

// GET ALL USER
router.get('/', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

router.post('/', async (req, res) => {
    const { email, username, password, role, first_name, last_name } = req.body;
    const user = await User.create({ email, username, password, role, first_name, last_name });
    res.json(user);
});


module.exports = router;