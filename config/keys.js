const mysql = require('mysql2');

function randomText(){
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

const text = randomText();

module.exports = {
    mysql: mysql.createConnection({
        host: 'localHost',
        user: 'root',
        database: 'user',
        password: '1996karich'
    }),
    text: text,
    jwt: "dev-jwt",
}
