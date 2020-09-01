const express = require('express');
const app = express();
const jsonParser = express.json();
const multer = require("multer");
const bodyParser = require('body-parser');
const session = require("express-session");
app.set("view engine", "ejs");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const registrationRoutes = require('./routes/registrartionRoutes.js');
const keys = require('./config/keys');
const ajaxRoutes = require('./routes/ajaxRouters.js');
app.use(express.static(__dirname + '/public'));

app.set("trust proxy", 1);

var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

app.use(session({
    secret: "root",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: expiryDate
    }
}))

const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
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

app.use(express.static(__dirname));
app.use(multer({storage: storageConfig, fileFilter: fileFilter}).single("photo"));
app.use('/', jsonParser, ajaxRoutes);
app.use('/', urlencodedParser, registrationRoutes);

app.listen(3000);