const express = require('express');
const app = express();
const jsonParser = express.json();
const multer = require("multer");
const bodyParser = require('body-parser');
const session = require("express-session");
app.set("view engine", "ejs");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const registrationRoutes = require('./routes/registrartionRoutes.js');
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


const randomText = () => {
    const array = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k',
        'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 1, 2, 3, 4, 5, 6, 7, 8, 9];

    let randomIndex;
    let randomText = "";
    for (let i = 0; i < 5; i++) {
        randomIndex = Math.floor(Math.random() * array.length);
        randomText += array[randomIndex];
    }
    console.log(randomText);
}

const appendPhotoName = randomText()
exports.text = appendPhotoName;
const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, appendPhotoName + file.originalname);
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