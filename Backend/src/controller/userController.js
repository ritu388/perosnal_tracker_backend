const express = require('express');
const db = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { body, validationResult } = require('express-validator');
require('dotenv').config();

router.post('/register',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
        body('mobile_no').isMobilePhone().withMessage('Invalid mobile number'),
    ], 
    async (req, res, next) => {
    try {
        const { full_name, email, mobile_no, password } = req.body;
        console.log(req.body);

        // Basic validation
        if (!full_name || !email || !mobile_no || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        // Check if user already exists
        db.query(
            `SELECT * FROM userDetail WHERE email = ? OR mobile_no = ?`,
            [email, mobile_no],
            async (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error' });
                }

                if (result.length > 0) {
                    return res.status(400).json({ message: 'Email or Mobile number already registered' });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert user
                const query = `
                    INSERT INTO userDetail (full_name, email, mobile_no, password)
                    VALUES (?, ?, ?, ?)
                `;
                db.query(query, [full_name, email, mobile_no, hashedPassword], (insertErr, result) => {
                    if (insertErr) {
                        return res.status(500).json({ message: 'Failed to register user' });
                    }
                    return res.status(200).json({
                        message: 'User registered successfully',
                        data: { id: result.id, full_name, email, mobile_no }
                    });
                });
            }
        );
    } catch (error) {
        next(error);
    }
});

router.post('/login', [body('loginId').isEmail().withMessage('Invalid email'), 
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('loginId').isMobilePhone().withMessage('Invalid mobile number'),
], (req, res, next) => {
    try {
        const { loginId, password } = req.body;

        if (!loginId || !password) {
            return res.status(400).json({ message: 'Please enter loginId and password' });
        }

        const query = `SELECT * FROM userDetail WHERE email = ? OR mobile_no = ?`;

        db.query(query, [loginId, loginId], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }

            if (result.length === 0) {
                return res.status(401).json({ message: 'Invalid email/mobile or password' });
            }

            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email/mobile or password' });
            }
            const secret_key = `26d695ec0dc7408c24ae9737dbf8055d13905d95d8d600826b28b0c9eeef237f`;
            // Generate token if needed (optional)
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || secret_key,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    mobile_no: user.mobile_no
                }
            });
        });
    } catch (er) {
        next(er);
    }

});

module.exports = router;
