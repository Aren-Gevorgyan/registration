const mysql = require('mysql2');

module.exports = {
    mysql: mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'user',
        port: '3306',
        password: '1996karich'
    }),
}
