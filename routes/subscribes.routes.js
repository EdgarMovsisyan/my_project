const SubscribeService = require('../services/subscribeService');
const UserService = require('../services/userService.js');
const { json } = require('body-parser');
const { Router } = require('express');

const router = Router();

const subscribe = new SubscribeService();
const userService = new UserService();

router.post('/subscribe/:id', async (req, res) => {
    try {
        
    } catch(e) {
        console.log(e)
    }
})

module.exports = router;