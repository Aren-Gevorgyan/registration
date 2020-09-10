const Users = require('../modules/registrationModules');
const Post = require('../modules/postModules');
const passwordHash = require('password-hash');
const keys = require('../config/keys')

exports.login = function (request, response) {
    response.render("login", {
        titleApp: "Login"
    })
}

exports.openRegistration = function (request, response) {
    response.render("registration", {
        titleApp: "Registration",
        title: "Registration"
    });
}

exports.users = function (request, response) {
    if (!request.body) return response.sendStatus(404);

    const userName = request.body.name;
    const userSurName = request.body.surName;
    const userAge = request.body.age;
    const userPhone = request.body.phone;
    const userPhoto = keys.text + request.file.originalname;
    const userEmail = request.body.email;
    const userLogin = request.body.login;
    const userPassword = request.body.password;
    const usersData = new Users(userName, userSurName, userAge, userPhone, userPhoto, userEmail,
        userLogin, userPassword);
    usersData.saveUserData();

    openProfile(response);
}

function openProfile(response) {
    Users.getUsersData(function (allData) {
        response.render('userProfile', {
            titleApp: "UserData",
            allDataUser: allData,
        })
    });
}

exports.edit = function (request, response) {
    const getIdUser = request.params.id;
    Users.editDataUser(getIdUser, function (allData) {
        response.render("edit", {
            titleApp: "Edit",
            user: allData
        })
    })
}

exports.email = function (request, response) {
    if (!request.body) return response.sendStatus(404);
    Users.getEmailDataFromUserData().then(data => {
        let ifEmailNotExists;
        let ifEmailIsNull;
        for (let i = 0; i < data.length; i++) {
            ifEmailNotExists = request.body.email === data[i].email;
            ifEmailIsNull = request.body.email.length === 0;
            if (ifEmailNotExists || ifEmailIsNull) {
                return response.json("Is email already exists or null, write new email");
            }
        }
        return response.json(request.body);
    });
}

function ifLoginIsNull(request, response) {
    let ifIsNull = request.body.login.length === 0;
    if (ifIsNull) {
        return response.sendStatus(401);
    }
}

exports.account = function (request, response) {
    const id = request.session.userId;
    const getUrlId = request.params['id'];
    const ifEqual = id === parseInt(getUrlId);
    if (ifEqual) {
        Users.getUserData(id)
            .then(data => {
                response.render("profile", {
                    titleApp: 'Account',
                    user: data
                });
            }).catch(err => {
            console.log(err.message);
        });
    } else {
        response.redirect("/");
    }
}

exports.profile = function (request, response) {
    if (!request.body) return response.sendStatus(404);
    const login = request.body.login;
    Users.verifyData(login).then(data => {
        request.session.userId = data[0].id;
        response.redirect("/account/" + data[0].id);
    }).catch(err => {
        console.log(err.message);
    });
}

exports.passwordLogin = function (request, response) {
    if (!request.body) return response.sendStatus(404);
    const password = request.body.password;
    const login = request.body.login;
    existLogin(password, login, response, request);
}

function existLogin(password, login, response, request) {
    Users.getLoginDataFromUserData(login).then(data => {
        ifLoginIsNull(request, response);
        if (data) {
            existPassword(password, login, response);
        } else {
            response.sendStatus(401)
        }
    }).catch(err => {
        console.log(err.message);
    });
}

function existPassword(password, login, response) {
    Users.passwordLoginExistsOrNot(password, login).then(passwordExistsOrNot => {
        if (passwordExistsOrNot) {
            response.sendStatus(200);
        } else {
            response.sendStatus(401);
        }
    }).catch(err => {
        console.log(err.message);
    });
}

exports.password = function (request, response) {
    if (!request.body) return response.sendStatus(404);
    Users.getPasswordDataFromUserData().then(data => {
        existsPassword(data, request, response);
    }).catch(err => {
        console.log(err.message);
    });
}

function existsPassword(data, request, response) {
    let ifPasswordNotExists;
    let ifPasswordIsNull;
    for (let i = 0; i < data.length; i++) {
        ifPasswordNotExists = passwordHash.verify(password, data[i].password);
        ifPasswordIsNull = request.body.password.length === 0;
        if (ifPasswordNotExists || ifPasswordIsNull) {
            return response.json("Password exists, write new password");
        } else {
            return response.json(request.body);
        }
    }
}

exports.delete = function (request, response) {
    response.json("Delete user data");
    Users.deleteUser(request.body.id);
}

exports.update = function (request, response) {
    if (!request.body) response.sendStatus(404);
    const idUser = request.body.id;
    const nameUser = request.body.name;
    const userName = request.body.userName;
    const ageUser = request.body.age;
    const phoneUser = request.body.phone;
    const emailUser = request.body.email;
    const userArray = [nameUser, userName, ageUser, phoneUser, emailUser, idUser];
    Users.updateUser(userArray);
    response.json(request.body);
}

exports.logout = function (request, response) {
    request.session.destroy();
    response.render("login", {
        titleApp: "Login"
    })
}

exports.comment = function (request, response) {
    if (!request.body) return response.sendStatus(404);
    const id = request.session.userId;
    const comment = request.body.comment;

    const post = new Post(id, comment, "");
    post.appendData();

    response.json(request.body);
}

exports.editComment = function (request, response){
    if (!request.body) return response.sendStatus(404);
    const id = request.session.userId;
    const comment = request.body.valueComment;
    const presentComment = request.body.presentComment;
    console.log(id, comment, presentComment)
    Post.editComment(comment, id, presentComment).then(res=>{
        response.sendStatus(200);
    }).catch(err=>{
        console.log(err.message);
    })
}

