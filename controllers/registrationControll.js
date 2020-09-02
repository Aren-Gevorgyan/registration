const Users = require('../modules/registrationModules');
const passwordHash = require('password-hash');
const keys = require('../config/keys')
const jwt = require('jsonwebtoken');

exports.login = function (request, response) {
    response.render("login", {
        titleApp: "Login"
    })
}

exports.account = function (request, response) {
    const id = request.session.userId;
    const getUrlId = request.params['id'];
    const ifEqual = id === parseInt(getUrlId);
    if (ifEqual) {
        Users.getUserData(id)
            .then(data => {
                response.render("profile", {
                    titleApp: "Account",
                    user: data
                });
                response.redirect("/account");
            }).catch(err => {
            console.log(err.message);
        });
    } else {
        response.redirect("/");
    }
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
    const token = createToken(userName, userEmail);
    const refreshToken = createToken(userName, userEmail);
    const usersData = new Users(userName, userSurName, userAge, userPhone, userPhoto, userEmail,
        userLogin, userPassword, token, refreshToken);
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

function createToken(name, email) {
    return 'Bearer ' + jwt.sign({
        name: name,
        email: email,
        text: randomText(),
    }, keys.jwt, {expiresIn: 60 * 60});
}

function randomText() {
    const array = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k',
        'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 1, 2, 3, 4, 5, 6, 7, 8, 9];

    let randomIndex;
    let randomText = "";
    for (let i = 0; i < 5; i++) {
        randomIndex = Math.floor(Math.random() * array.length);
        randomText += array[randomIndex];
    }
    return randomText;
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

// exports.existLogin = function (request, response) {
//     if (!request.body) return response.sendStatus(404);
//     Users.getLoginDataFromUserData().then(data => {
//         let ifLoginNotExists;
//         ifLoginIsNull(request, response);
//         for (let i = 0; i < data.length; i++) {
//             ifLoginNotExists = request.body.login === data[i].login;
//             if (ifLoginNotExists) {
//                 return response.json(request.body);
//             }
//         }
//         return response.json("Is false login or null, write new email");
//     }).catch(err => {
//         console.log(err.message);
//     });
// }
//

function ifLoginIsNull(request, response) {
    let ifIsNull = request.body.login.length === 0;
    if (ifIsNull) {
        return response.json("Is false login or null, write new login");
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
    Users.getLoginDataFromUserData().then(data => {
        let loginExists;
        ifLoginIsNull(request, response);
        for (let i = 0; i < data.length; i++) {
            loginExists = request.body.login === data[i].login;
            if (loginExists) {
                existPassword(password, login, response);
            } else if (i === data.length) {
                response.json("login false");
            }
        }
    }).catch(err => {
        console.log(err.message);
    });
}

function existPassword(password, login, response) {
    Users.passwordLoginExistsOrNot(password, login).then(passwordExistsOrNot => {
        if (passwordExistsOrNot) {
            responseToken(login, response)
        } else {
            response.json("Is password false  or null, write new password");
        }
    }).catch(err => {
        console.log(err.message);
    });
}

function responseToken(login, response) {
    Users.getToken(login).then(res => {
        response.json({
            token: res.token,
            refreshToken: res.refreshToken
        });
    }).catch(() => {
        response.sendStatus(401);
    })
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

