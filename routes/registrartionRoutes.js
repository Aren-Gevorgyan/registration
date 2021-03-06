const express = require('express');
const registrationControllers = require('../controllers/registrationControll.js');
const registrationRoutes = express.Router();

registrationRoutes.get('/users/edit/:id', registrationControllers.edit);
registrationRoutes.get('/account/:id', registrationControllers.account);
registrationRoutes.get('/registration', registrationControllers.openRegistration);
registrationRoutes.get('/logout', registrationControllers.logout);
registrationRoutes.post('/profile', registrationControllers.profile);
registrationRoutes.post('/users', registrationControllers.users);
registrationRoutes.get('/', registrationControllers.login);

module.exports = registrationRoutes;