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
        this.photo = photo;
        usersData.push(this.name);
        usersData.push(this.surName);
        usersData.push(this.age);
        usersData.push(this.phone);
        usersData.push(this.email);
        usersData.push(this.password);
        usersData.push(this.login);
        usersData.push(this.photo);
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

    static getLoginDataFromUserData() {
        return new Promise(function (resolve, reject) {
            connectionMySql.query("SELECT login FROM userData", function (err, result) {
                if (err) {
                    reject(err);
                } else {
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
        const sql = "UPDATE userData SET name = ?, userName = ?, age = ?, phone = ?, email = ?, photo = ? WHERE id = ? ";
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
            connectionMySql.query(sql, login, function (err, result) {
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
            const sql = "SELECT name, userName, photo FROM userdata WHERE id = ?";
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

