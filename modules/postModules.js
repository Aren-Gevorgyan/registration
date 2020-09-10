const keys = require('../config/keys');
const connectionMySql = keys.mysql;
const postAndComment = [];

connectionMySql.connect(function (err) {
    if (err) {
        console.error(err.message);
    }
});

module.exports = class Post {
    constructor(userId, comment, post) {
        this.userId = userId;
        this.comment = comment;
        this.post = post;
        postAndComment.push(this.userId, this.comment, this.post);
    }

    appendData() {
        const sql = "INSERT INTO post(USERID, COMMENT, POST) VALUE (?,?,?)";
        connectionMySql.query(sql, postAndComment, (err) => {
            if (err) {
                console.log(err);
            }
        })
        postAndComment.length = 0;
    }

    static editComment(comment, id, presentComment) {
        console.log(comment, id, presentComment);
        return new Promise(function (resolve, reject){
            const sql = "UPDATE post SET comment = ? WHERE userId = ? AND comment = ?";
            connectionMySql.query(sql, [comment, id, presentComment], (err, result) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    }
}