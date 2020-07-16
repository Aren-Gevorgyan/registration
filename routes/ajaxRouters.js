const express = require('express');
const registrationControllers = require('../controllers/registrationControll');
const ajaxRouters = express.Router();

ajaxRouters.post("/password/login", registrationControllers.passwordLogin);
ajaxRouters.post("/existLogin", registrationControllers.existLogin);
ajaxRouters.post("/password", registrationControllers.password);
ajaxRouters.post("/email", registrationControllers.email);
ajaxRouters.post("/update", registrationControllers.update);
ajaxRouters.post("/delete", registrationControllers.delete);

module.exports = ajaxRouters;
