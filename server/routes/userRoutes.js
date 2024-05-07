const express = require('express');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');  
const jwt = require('jsonwebtoken');

const router = express.Router();


router.get('/', asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}); 
        res.json(users.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email
        })));
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));



router.post('/signup', asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' }); 
    } 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        email,
        passwordHash: hashedPassword
    });
    const createdUser = await user.save();

    res.status(201).json({
        _id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email
    });
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '24h' });  
    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token  
    });
}));

module.exports = router;
