const express = require('express');
const registrationControllers = require('../controllers/registrationControll');
const ajaxRouters = express.Router();

ajaxRouters.post("/comment/edit", registrationControllers.editComment);
ajaxRouters.post("/comment/delete", registrationControllers.deleteComment);
ajaxRouters.post("/password/login", registrationControllers.passwordLogin);
ajaxRouters.post("/comment", registrationControllers.comment);
ajaxRouters.post("/password", registrationControllers.password);
ajaxRouters.post("/email", registrationControllers.email);
ajaxRouters.post("/update", registrationControllers.update);
ajaxRouters.post("/delete", registrationControllers.delete);

module.exports = ajaxRouters;
