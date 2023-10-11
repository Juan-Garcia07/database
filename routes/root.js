const express = require('express');
const router = express.Router();
const usersRoutes = require('./users');

router.use('/users', usersRoutes);

module.exports = router

// http://localhost:3000/api/v1/users