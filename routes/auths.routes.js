const { check, validationResult } = require('express-validator');
const UserService = require('../services/userService.js');
const { json } = require('body-parser');
const { Router } = require('express');

const router = Router();

const userService = new UserService();

router.post('/reg',
    [
        check('email', 'incorrect email').normalizeEmail().isEmail(),
        check('password', 'minimum password length 6 characters').
        isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'incorect data during registration'
                });
            }

            const { firstName, lastName,
                    email, password, phone } = req.body;

            const searchByEmail = await userService.findUserByEmail(email);
            const searchByPhone = await userService.findUserByPhone(phone);

            if(searchByEmail || searchByPhone) {
                return res.status(400).json({ message: 'This email or phone is already exists' });
            }
            
            const newUser = await userService.create(firstName, lastName, email, password, phone);

            return res.status(201).json({
                message: 'user created',
                user: newUser
            });
        } catch(e) {
            return res.status(500).json({ message: e.message });
        }
    }
);

router.post('/login', [
    check('email', 'enter correct email').normalizeEmail().isEmail(),
    check('password', 'enter password').exists()
], 
async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'invalid login data'
            });
        }

        const { email, password } = req.body;

        const userLogin = await userService.login(email, password);

        if(userLogin.user) {
            return res.status(400).json({ message: userLogin.error_message });
        }

        return res.status(201).json(userLogin);

        
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
})

module.exports = router;