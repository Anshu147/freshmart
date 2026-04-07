const express = require('express');
const { chatSearch } = require('../controllers/chatController');

const router = express.Router();

router.post('/', chatSearch);

module.exports = router;
