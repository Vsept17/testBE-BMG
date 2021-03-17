const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const shortId = require("shortid");

const db = require("../config/mySQL");

module.exports = {
  postNewUser: (body) => {
    return new Promise((resolve, reject) => {
      const email = body.email;
      const username = body.username;
      const name = body.name;
      const password = body.password;
      const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      const regexPwd = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
      const queryCheckEmail = "SELECT email FROM users WHERE email=?";
      const queryCheckUsername = "SELECT username FROM users WHERE username=?";
      db.query(queryCheckEmail, email, (err, data) => {
        if (!data[0]) {
          db.query(queryCheckUsername, username, (err, data) => {
            if (!data[0]) {
              if (!regexEmail.test(email)) {
                reject({
                  message: "Please fill your Email correctly!",
                  status: 403,
                });
              } else if (
                email === "" ||
                username === "" ||
                name === "" ||
                password === ""
              ) {
                reject({
                  message: "Please, fill all data!",
                  status: 403,
                });
              } else if (!regexPwd.test(username)) {
                reject({
                  message:
                    "Username should at least have 1 LowCase (a-z), 1 UpperCase (A-Z), 1 Number (0-9)",
                  status: 403,
                });
              } else if (!regexPwd.test(password)) {
                reject({
                  message:
                    "Password should at least have 1 LowCase (a-z), 1 UpperCase (A-Z), 1 Number (0-9)",
                  status: 403,
                });
              } else {
                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, (err, salt) => {
                  if (err) {
                    reject(err);
                  }
                  bcrypt.hash(body.password, salt, (err, hashedPassword) => {
                    if (err) {
                      reject(err);
                    }
                    const refCode = shortId.generate();
                    const newBody = {
                      ...body,
                      referral_code: refCode,
                      password: hashedPassword,
                    };
                    const queryString = "INSERT INTO users SET ?";
                    db.query(queryString, newBody, (err, data) => {
                      if (!err) {
                        resolve(data);
                      } else {
                        reject(err);
                      }
                    });
                  });
                });
              }
            } else {
              reject({
                message: "Username is already exists!",
                status: 403,
              });
            }
          });
        } else {
          reject({
            message: "Email is already exists!",
            status: 403,
          });
        }
      });
    });
  },

  postLogin: (body) => {
    return new Promise((resolve, reject) => {
      const { username, password } = body;
      const qs = "SELECT password FROM users WHERE username = ? ";
      db.query(qs, username, (err, data) => {
        if (err) {
          reject({
            msg: "Error SQL",
            status: 500,
            err,
          });
        }
        if (!data[0]) {
          reject({
            msg: "User not found",
            status: 404,
          });
        } else {
          bcrypt.compare(password, data[0].password, (err, result) => {
            if (err) {
              reject({
                msg: "Hash Error",
                status: 500,
                err,
              });
            }
            if (!result) {
              reject({
                msg: "Wrong password",
                status: 401,
              });
            } else {
              const payload = {
                username,
              };
              const secret = process.env.SECRET_KEY;
              const token = jwt.sign(payload, secret);
              resolve({ username, token });
            }
          });
        }
      });
    });
  },

  editProfile: (body, id, user_id) => {
    console.log(body);
    return new Promise((resolve, reject) => {
      const password = body.password
      console.log("pass", password);
      if (password === undefined) {
      const queryString = "UPDATE users SET ? WHERE id = ?";
      db.query(queryString, [body, id], (err, data) => {
        if (!err) {
          resolve(data);
          console.log("ini id", id);
        } else {
          reject(err);
        }
      });
      } else {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            reject(err);
          }
          bcrypt.hash(body.password, salt, (err, hashedPassword) => {
            if (err) {
              reject(err);
            }
            const newBody = {
              password: hashedPassword,
            };
            const queryString = "UPDATE users SET ? WHERE id = ?";
            db.query(queryString, [newBody, id], (err, data) => {
              if (!err) {
                resolve(data);
                console.log("ini id", id);
              } else {
                reject(err);
                console.log(err);
              }
            });
          });
        });

      }
    });
  },
};
