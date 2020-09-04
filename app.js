const express = require('express');
const app = express();
const jsonParser = express.json();
const multer = require("multer");
const bodyParser = require('body-parser');
const session = require("express-session");
const registrationRoutes = require('./routes/registrartionRoutes.js');
const keys = require('./config/keys');
const ajaxRoutes = require('./routes/ajaxRouters.js');
app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");
app.set("trust proxy", 1);

app.use(session({
    secret: "root",
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        cb(null, keys.text + file.originalname);
    }
})

const fileFilter = function (req, file, cb) {
    if (file.mimetype === "image/png"
        || file.mimetype === "image/jpg"
        || file.mimetype === "image/jpeg"
        || file.mimetype === "image/svg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(multer({storage: storageConfig, fileFilter: fileFilter}).single("photo"));
app.use('/', jsonParser, ajaxRoutes);
app.use('/', registrationRoutes);

app.listen(3000);