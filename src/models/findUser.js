const db = require("../config/mySQL");

module.exports = {
  findUser: (keyword) => {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT username, name, email FROM users AS u WHERE name LIKE "%${keyword}%"`;
      db.query(queryString, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
};
