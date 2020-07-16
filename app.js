const express = require('express');
const app = express();
const jsonParser = express.json();
const multer = require("multer");
const bodyParser = require('body-parser');
app.set("view engine", "ejs");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const registrationRoutes = require('./routes/registrartionRoutes.js');
const ajaxRoutes = require('./routes/ajaxRouters.js');
app.use(express.static(__dirname + '/public'));


const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const fileFilter = function(req, file, cb){
    if(file.mimetype === "image/png"
        || file.mimetype === "image/jpg"
        || file.mimetype === "image/jpeg"
        || file.mimetype === "image/svg"){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

app.use(express.static(__dirname));
app.use(multer({storage: storageConfig, fileFilter: fileFilter}).single("photo"));
app.use('/', jsonParser, ajaxRoutes);
app.use('/', urlencodedParser, registrationRoutes);

app.listen(3000);