const mysql = require('mysql2');
module.exports = {
 mysql: mysql.createConnection({
     host: 'localHost',
     user: 'root',
     database: 'user',
     password: '1996karich'
 })
}
