const mysql = require('mysql2');
const usersData = [];
const passwordHash = require('password-hash');

function connectMySql() {
    return mysql.createConnection({
        host: 'localHost',
        user: 'root',
        database: 'user',
        password: '1996karich'
    });
}

const connectionMySql = connectMySql();

connectionMySql.connect(function (err) {
    if (err) {
        console.error(err.message);
    }
});

module.exports = class User {
    constructor(name, surName, age, phone, email, password, login, photo) {
        this.name = name;
        this.surName = surName;
        this.age = age;
        this.phone = phone;
        this.email = email;
        this.password = passwordHash.generate(password);
        this.login = login;
        this.photo = photo;//
        usersData.push(this.name);
        usersData.push(this.surName);
        usersData.push(this.age);
        usersData.push(this.phone);
        usersData.push(this.email);
        usersData.push(this.password);
        usersData.push(this.login);
        usersData.push(this.photo);//
    }

    saveUserData() {
        const mySql = "INSERT INTO userdata(NAME, USERNAME, AGE, PHONE, EMAIL, PASSWORD, LOGIN, PHOTO) VALUES (?,?,?,?,?,?,?,?);";
        connectionMySql.query(mySql, usersData, function (err, result) {
            if (err) {
                console.error(err.message);
            } else {
                console.log("Set user data in data base");
            }
        })
        usersData.length = 0;
    }

    static getEmailDataFromUserData(request, response) {
        connectionMySql.query("SELECT email FROM userData", function (err, result) {
            if (err) {
                console.error(err.message);
            } else {
                return User.emailExistsOrNot(request, response, result);
            }
        });
    }

    static emailExistsOrNot(request, response, result) {
        let ifEmailNotExists;
        let ifEmailIsNull;
        for (let i = 0; i < result.length; i++) {
            ifEmailNotExists = request.body.email === result[i].email;
            ifEmailIsNull = request.body.email.length === 0;
            if (ifEmailNotExists || ifEmailIsNull) {
                return response.json("Is email already exists or null, write new email");
            }
        }
        return response.json(request.body);
    }

    static getLoginDataFromUserData(request, response) {
        connectionMySql.query("SELECT login FROM userData", function (err, result) {
            if (err) {
                console.error(err.message);
            } else {
                return User.loginExistsOrNot(request, response, result);
            }
        });
    }

    static loginExistsOrNot(request, response, result) {
        let ifLoginNotExists;
        let ifLoginIsNull;
        for (let i = 0; i < result.length; i++) {
            ifLoginNotExists = request.body.login !== result[i].login;
            ifLoginIsNull = request.body.login.length === 0;
            if (ifLoginNotExists || ifLoginIsNull) {
                return response.json("Is false login or null, write new email");
            }else{
                return response.json(request.body);
            }
        }
    }

    static getPasswordDataFromUserData(request, response, password) {
        connectionMySql.query("SELECT password FROM userData", function (err, result) {
            if (err) {
                console.error(err.message);
            } else {
                return User.passwordExistsOrNot(request, response, result, password);
            }
        });
    }

    static passwordExistsOrNot(request, response, result, password) {
        let ifPasswordNotExists;
        let ifPassWordIsNull;
        for (let i = 0; i < result.length; i++) {
            ifPasswordNotExists = passwordHash.verify(password, result[i].password);
            ifPassWordIsNull = request.body.password.length === 0;
            if (ifPasswordNotExists || ifPassWordIsNull) {
                return response.json("Password exists, write new password");
            }else {
                return response.json(request.body);
            }
        }
    }

    static getUsersData(allData) {

        const sql = "SELECT * FROM userdata";
        connectionMySql.query(sql, function (err, result) {
            if (err) {
                console.log("Error" + err.message);
            } else {
                return allData(result);
            }
        })
    }

    static editDataUser(getUserId, getDataUser) {

        const sql = "SELECT * FROM userData WHERE id = ?";
        connectionMySql.query(sql, getUserId, function (err, result) {
            if (err) {
                console.log("Error" + err.message);
            } else {
                return getDataUser(result);
            }
        })
    }

    static updateUser(userData) {
        const sql = "UPDATE userData SET name = ?, userName = ?, age = ?, phone = ?, email = ? WHERE id = ? ";
        connectionMySql.query(sql, userData, function (err, result) {
            if (err) {
                console.log("Error" + err.message);
            } else {
                console.log("User data update");
            }
        })
    }

    static deleteUser(getUserId) {
        const sql = "DELETE FROM userData WHERE id = ?";
        connectionMySql.query(sql, getUserId, function (err, result) {
            if (err) {
                console.log("Error" + err.message);
            } else {
                console.log("User data delete");
            }
        })
    }

    static passwordLoginExistsOrNot(password, login) {
        return new Promise(function (resolve, reject) {
            const sql = "SELECT password FROM userdata WHERE login = ?";
            connectionMySql.query(sql, login, function (err, result) {
                if (err) {
                    reject(err.message);
                } else {
                    const hash_pass = result[0].password;
                    resolve(passwordHash.verify(password, hash_pass));
                }
            })
        })
    }

    static getUserData(login) {
        return new Promise(function (resolve, reject) {
            const sql = "SELECT name, userName, photo FROM userdata WHERE login = ?";
            connectionMySql.query(sql, login, function (err, result) {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(result);
                }
            })
        })
    }
}

