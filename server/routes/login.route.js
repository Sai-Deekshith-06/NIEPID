const express = require('express');
const routes = express.Router();
const { checkUser, saveUser } = require('../controllers/login.controller');
const { changePassword } = require('../controllers/changePassword.controller');

routes.post('/', checkUser);
routes.post('/signup', saveUser);
module.exports = routes;