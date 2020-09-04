const usersData = [];
const passwordHash = require('password-hash');
const keys = require('../config/keys');
const connectionMySql = keys.mysql;

connectionMySql.connect(function (err) {
    if (err) {
        console.error(err.message);
    }
});

module.exports = class User {
    constructor(name, surName, age, phone, photo, email, login, password) {
        this.name = name;
        this.surName = surName;
        this.age = age;
        this.phone = phone;
        this.photo = photo;
        this.email = email;
        this.login = login;
        this.password = passwordHash.generate(password);
        usersData.push(this.name, this.surName, this.age, this.phone, this.photo, this.email,
            this.login, this.password);
    }

    saveUserData() {
        const mySql = "INSERT INTO userdata(name, userName, age, phone, photo, email, login, password)" +
            " VALUES (?,?,?,?,?,?,?,?)";
        connectionMySql.query(mySql, usersData, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log("Set user data in data base");
            }
        })
        usersData.length = 0;
    }

    static getEmailDataFromUserData() {
        return new Promise(function (resolve, reject) {
            connectionMySql.query("SELECT email FROM userData", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
    }

    static getLoginDataFromUserData(login) {
        return new Promise(function (resolve, reject) {
            const sql = "SELECT login FROM userData where login = ?"
            connectionMySql.query(sql, [login], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    result = result[0] !== undefined;
                    resolve(result);
                }
            });
        })
    }

    static getPasswordDataFromUserData() {
        return new Promise(function (resolve, reject) {
            connectionMySql.query("SELECT password FROM userData", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
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
        const sql = "UPDATE userData SET name = ?, userName = ?, age = ?, phone = ?, photo = ?, email = ?,  WHERE id = ? ";
        connectionMySql.query(sql, userData, (err) => {
            if (err) {
                console.log("Error" + err.message);
            } else {
                console.log("User data update");
            }
        })
    }

    static deleteUser(getUserId) {
        const sql = "DELETE FROM userData WHERE id = ?";
        connectionMySql.query(sql, getUserId, (err) => {
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
            connectionMySql.query(sql, [login], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    const hash_pass = result[0].password;
                    resolve(passwordHash.verify(password, hash_pass));
                }
            })
        })
    }

    static verifyData(login) {
        return new Promise(function (resolve, reject) {
            const sql = "SELECT id, name, userName, photo FROM userdata WHERE login = ?";
            connectionMySql.query(sql, [login], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }

    static getUserData(id) {
        return new Promise(function (resolve, reject) {
            const sql = "SELECT id, name, userName, photo FROM userdata WHERE id = ?";
            connectionMySql.query(sql, [id], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }
}

