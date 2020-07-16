const Users = require('../modules/registrationModules');

exports.login = function (request, response) {
    response.render("login", {
        titleApp: "Login"
    });
}

exports.profile = function (request, response) {
    if (!request.body) return response.sendStatus(404);
    const login = request.body.login;
    Users.getUserData(login).then(data => {
        console.log(data);
        response.render("profile", {
            titleApp: "Profile",
            name: data[0].name,
            surName: data[0].userName,
            photo: data[0].photo,
        });
    })
}

exports.openRegistration = function (request, response) {
    response.render("registration", {
        titleApp: "Registration",
        title: "Registration"
    });
}

exports.users = function (request, response, next) {
    if (!request.body) return response.sendStatus(404);

    const userName = request.body.name;
    const userSurName = request.body.surName;
    const userAge = request.body.age;
    const userPhone = request.body.phone;
    const userEmail = request.body.email;
    const userPassword = request.body.password;
    const userLogin = request.body.login;
    const userPhoto = request.file.originalname;
    const usersData = new Users(userName, userSurName, userAge, userPhone, userEmail, userPassword, userLogin, userPhoto);
    usersData.saveUserData();

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
    Users.getEmailDataFromUserData(request, response);
}

exports.existLogin = function (request, response) {
    if (!request.body) return response.sendStatus(404);
    Users.getLoginDataFromUserData(request, response);
}

exports.passwordLogin = function (request, response) {
    if (!request.body) return response.sendStatus(404);
    const password = request.body.password;
    const login = request.body.login;
    Users.passwordLoginExistsOrNot(password, login).then(passwordExistsOrNot => {
        if (passwordExistsOrNot) {
            response.json(request.body);
        } else {
            response.json("Is password false  or null, write new password");
        }
    });
}

exports.password = function (request, response) {
    if (!request.body) return response.sendStatus(404);
    const password = request.body.password;
    Users.getPasswordDataFromUserData(request, response, password);
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

